import useUser from './useUser';

function withUser<P>(Component: React.ComponentType<P>) {
	return function WrappedComponent(props: P) {
		const userProps = useUser();
		return (
			<Component
				{...props}
				{...userProps}
			/>
		);
	};
}

export default withUser;
