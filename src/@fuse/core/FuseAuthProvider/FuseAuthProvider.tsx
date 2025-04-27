import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { FuseAuthProviderType, FuseAuthProviderMethods, FuseAuthProviderState } from './types/FuseAuthTypes';
import FuseAuthContext from './FuseAuthContext';
import { AuthState, initialAuthState } from './FuseAuthContext';
const authProviderLocalStorageKey = 'fuseReactAuthProvider';

type FuseAuthenticationProviderProps = {
	children: (authState: FuseAuthProviderState | null) => React.ReactNode;
	providers: FuseAuthProviderType[];
	onAuthStateChanged?: (authState: FuseAuthProviderState) => void;
};

function FuseAuthProvider(props: FuseAuthenticationProviderProps) {
	const { children, providers } = props;

	const [authState, setAuthState] = useState<AuthState | null>(initialAuthState);

	const currentAuthStatus = useMemo(() => authState?.authStatus, [authState]);
	const [isLoading, setIsLoading] = useState(true);
  
	const [providerStatuses, setProviderStatuses] = useState<Record<string, string>>({});
	const providerRefs = useRef<Record<string, FuseAuthProviderMethods | null>>({});
	const currentProvider = useMemo(() => providerRefs.current[authState?.provider ?? ''], [authState, providerRefs]);
  console.log('⚡ FuseAuthProvider initialized', authState, currentProvider);

	const allProvidersReady = useMemo(() => {
		return providers.every(
			(provider) => providerStatuses[provider.name] && providerStatuses[provider.name] !== 'configuring'
		);
	}, [providers, providerStatuses]);

	const getAuthProvider = useCallback(() => {
		return localStorage.getItem(authProviderLocalStorageKey);
	}, []);

	const setAuthProvider = useCallback((authProvider: string) => {
		if (authProvider) {
			localStorage.setItem(authProviderLocalStorageKey, authProvider);
		}
	}, []);

	const resetAuthProvider = useCallback(() => {
		localStorage.removeItem(authProviderLocalStorageKey);
	}, []);

	const handleAuthStateChange = useCallback(
		(providerAuthState: FuseAuthProviderState, name: string) => {
      console.log('⚡ handleAuthStateChange called', providerAuthState);
			setProviderStatuses((prevStatuses) => ({
				...prevStatuses,
				[name]: providerAuthState.authStatus
			}));
			setAuthState((prev) => {
        console.log('⚡ setAuthState called', prev, providerAuthState, name);
				// Scenario 1: Same provider, user logged out
				if (prev && prev.provider === name && !providerAuthState.isAuthenticated) {
					// return initialAuthState;
          return { ...providerAuthState, provider: name };
				}

				// Scenario 2: Ignore unauthenticated state if previously authenticated
				if (prev && prev.isAuthenticated && !providerAuthState.isAuthenticated) {
					return prev;
				}

				// Scenario 3: Update provider if previously unauthenticated
				if (prev && !prev.isAuthenticated && providerAuthState.isAuthenticated && providerAuthState.user) {
					setAuthProvider(name);
					return { ...providerAuthState, provider: name };
				}

				return prev;
			});
		},
		[setAuthProvider]
	);

	/* useEffect(() => {
		if (onAuthStateChanged) {
			if (authState) {
				onAuthStateChanged(authState);
			}
		}
	}, [onAuthStateChanged, authState]); */

	useEffect(() => {
    console.log('⚡ useEffect for allProvidersReady', allProvidersReady, currentAuthStatus);
		if (allProvidersReady && currentAuthStatus !== 'configuring') {
			setIsLoading(false);
		}
	}, [allProvidersReady, currentAuthStatus]);

	const signOut = useCallback(() => {
		if (currentProvider) {
			currentProvider?.signOut();
			resetAuthProvider();
		} else {
			// eslint-disable-next-line no-console
			console.warn('No current auth provider to sign out from');
		}
	}, [currentProvider, resetAuthProvider]);

	/* const updateUser = useCallback(
		async (_userData: PartialDeep<User>) => {
			if (currentProvider?.updateUser) {
				return currentProvider?.updateUser(_userData);
			}

			throw new Error('No current auth provider to updateUser from');
		},
		[currentProvider]
	); */

	const contextValue = useMemo(
		() => ({
			isAuthenticated: authState?.isAuthenticated,
			getAuthProvider,
			setAuthProvider,
			resetAuthProvider,
			providers,
			signOut,
			// updateUser,
			authState
		}),
		[authState, getAuthProvider, setAuthProvider, resetAuthProvider, providers, signOut]
	);

	// Nest providers with handleAuthStateChange and ref
	/* const nestedProviders = useMemo(
		() =>
			providers.reduceRight(
				(acc, { Provider, name }) => {
					return (
						<Provider
							key={name}
							ref={(ref: FuseAuthProviderMethods | null) => {
								providerRefs.current[name] = ref;
							}}
							onAuthStateChanged={(authState) => {
								handleAuthStateChange(authState, name);
							}}
						>
							{acc}
						</Provider>
					);
				},
				!isLoading ? children(authState) : <FuseLoading />
			),
		[providers, isLoading, handleAuthStateChange, children, authState]
	); */

  const nestedProviders = useMemo(() => {
    console.log('⚡ nestedProviders recomputed');
    console.log('   isLoading:', isLoading);
    console.log('   authState:', authState);
  
    const initialChildren = !isLoading ? (
      (() => {
        console.log('✅ isLoading is false, calling children(authState)');
        return children(authState);
      })()
    ) : (
      (() => {
        console.log('⏳ isLoading is true, showing <FuseLoading />');
        return <FuseLoading />;
      })()
    );
  
    const wrappedProviders = providers.reduceRight(
      (acc, { Provider, name }) => {
        console.log(`🔁 Wrapping provider: ${name}`);
        return (
          <Provider
            key={name}
            ref={(ref: FuseAuthProviderMethods | null) => {
              console.log(`📌 Setting ref for provider: ${name}`, ref);
              providerRefs.current[name] = ref;
            }}
            onAuthStateChanged={(authState) => {
              console.log(`🔄 onAuthStateChanged called for ${name}`, authState);
              handleAuthStateChange(authState, name);
            }}
          >
            {acc}
          </Provider>
        );
      },
      initialChildren
    );
  
    return wrappedProviders;
  }, [providers, isLoading, handleAuthStateChange, children, authState]);
  

	return <FuseAuthContext.Provider value={contextValue}>{nestedProviders}</FuseAuthContext.Provider>;
}

export default FuseAuthProvider;
