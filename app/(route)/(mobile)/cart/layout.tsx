interface CartLayoutProps {
	children: React.ReactNode;
}

export default async function CartLayout({ children }: CartLayoutProps) {
	return (
		<>
			<main>{children}</main>
		</>
	);
}
