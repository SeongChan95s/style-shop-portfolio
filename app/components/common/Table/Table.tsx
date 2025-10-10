'use client';

import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	PaginationState
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import styles from './Table.module.scss';

export interface TableColumn {
	field: string;
	value: string;
	width?: number;
	transform?: (value: unknown) => string | number;
	sortable?: boolean;
	filterable?: boolean;
}

interface TableProps<T> {
	data: T[];
	columns: TableColumn[];
	onClickRow?: (item: T) => void;
	pagination?: boolean;
	pageSize?: number;
}

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
	const keys = path.split('.');
	let result: unknown = obj;

	for (const key of keys) {
		if (result && typeof result === 'object' && key in result) {
			result = (result as Record<string, unknown>)[key];
		} else {
			return '';
		}
	}

	return result;
};

export default function Table<T>({
	data,
	columns,
	onClickRow,
	pagination = false,
	pageSize = 10
}: TableProps<T>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>({
		pageIndex: 0,
		pageSize
	});

	const tableColumns = useMemo<ColumnDef<T>[]>(() => {
		const cols: ColumnDef<T>[] = [
			{
				id: 'index',
				header: 'No.',
				cell: () => '',
				size: 36,
				enableSorting: false,
				enableColumnFilter: false
			}
		];

		columns.forEach(column => {
			cols.push({
				accessorKey: column.value as keyof T,
				header: column.field,
				maxSize: column.width,
				enableSorting: column.sortable !== false,
				enableColumnFilter: column.filterable !== false,
				accessorFn: row => getNestedValue(row as Record<string, unknown>, column.value),
				cell: ({ getValue }) => {
					const value = getValue();
					const displayValue = column.transform
						? column.transform(value)
						: typeof value === 'string' || typeof value === 'number'
							? value
							: '';
					return displayValue;
				}
			});
		});

		return cols;
	}, [columns]);

	const table = useReactTable({
		data,
		columns: tableColumns,
		state: {
			sorting,
			columnFilters,
			...(pagination && { pagination: paginationState })
		},
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		...(pagination && { onPaginationChange: setPaginationState }),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		...(pagination && { getPaginationRowModel: getPaginationRowModel() })
	});

	return (
		<div className={styles.table}>
			<table>
				<colgroup>
					{table.getHeaderGroups()[0]?.headers.map(header => (
						<col
							key={header.id}
							width={header.getSize() ? `${header.getSize()}px` : undefined}
						/>
					))}
				</colgroup>
				<thead>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<th
									key={header.id}
									onClick={
										header.column.getCanSort()
											? header.column.getToggleSortingHandler()
											: undefined
									}
									style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
									{header.column.getCanSort() && (
										<span>
											{{
												asc: ' ↑',
												desc: ' ↓'
											}[header.column.getIsSorted() as string] ?? ' ↕'}
										</span>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row, displayIndex) => (
						<tr key={row.id} onClick={() => onClickRow?.(row.original)}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>
									{cell.column.id === 'index'
										? (() => {
												const currentPageIndex = pagination
													? table.getState().pagination.pageIndex
													: 0;
												const pageSize = pagination
													? table.getState().pagination.pageSize
													: data.length;
												return currentPageIndex * pageSize + displayIndex + 1;
											})()
										: flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{pagination && (
				<div className={styles.pagination}>
					<button
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}>
						{'<<'}
					</button>
					<button
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						{'<'}
					</button>
					<span>
						페이지{' '}
						<strong>
							{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
						</strong>
					</span>
					<button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						{'>'}
					</button>
					<button
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}>
						{'>>'}
					</button>
				</div>
			)}
		</div>
	);
}
