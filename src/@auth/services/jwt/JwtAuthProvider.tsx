import { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { FuseAuthProviderComponentProps, FuseAuthProviderMethods, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { authRefreshToken, authSignUp, authUpdateDbUser } from '@auth/authApi';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/apiFetch';
import JwtAuthContext from '@auth/services/jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';

export type JwtSignInPayload = {
  email: string;
  password: string;
};

export type JwtSignUpPayload = {
  displayName: string;
  email: string;
  password: string;
};
const JwtAuthProvider = forwardRef<FuseAuthProviderMethods, FuseAuthProviderComponentProps>(
  ({ children, onAuthStateChanged }, ref) => {
    // function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
    // const { ref, children, onAuthStateChanged } = props;

    const {
      value: tokenStorageValue,
      setValue: setTokenStorageValue,
      removeValue: removeTokenStorageValue
    } = useLocalStorage<string>('jwt_access_token');

    /**
     * Fuse Auth Provider State
     */
    const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
      authStatus: 'configuring',
      isAuthenticated: false,
      user: null
    });

    /**
     * Watch for changes in the auth state
     * and pass them to the FuseAuthProvider
     */
    useEffect(() => {
      if (onAuthStateChanged) {
        onAuthStateChanged(authState);
      }
    }, [authState]);

    /**
     * Attempt to auto login with the stored token
     */
    useEffect(() => {
      const attemptAutoLogin = async () => {
        console.log('⚡ attemptAutoLogin', tokenStorageValue);
        const accessToken = tokenStorageValue;

        // if (accessToken && isTokenValid(accessToken)) {
        if (accessToken) {
          const userData =JSON.parse(accessToken) as User;
          return userData;

          /* try {
            const response = await authSignInWithToken(accessToken);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = (await response.json()) as User;

            return userData;
          } catch {
            return false;
          } */
        }

        return false;
      };

      if (!authState.isAuthenticated) {
        attemptAutoLogin().then((userData) => {
          console.log('⚡ attemptAutoLogin', userData);
          if (userData) {
            setAuthState({
              authStatus: 'authenticated',
              isAuthenticated: true,
              user: userData
            });
          } else {
            removeTokenStorageValue();
            removeGlobalHeaders(['Authorization']);
            setAuthState({
              authStatus: 'unauthenticated',
              isAuthenticated: false,
              user: null
            });
          }
        });
      }
      // eslint-disable-next-line
    }, [authState.isAuthenticated]);

    /**
     * Sign in
     */
    const signIn: JwtAuthContextType['signIn'] = useCallback(
      async (_: JwtSignInPayload) => {
        let user: User = {
          id: '1',
          role: 'admin',
          displayName: 'Bright Saharia',
          email: 'bright@mail.com',
        };
        setAuthState({
          authStatus: 'authenticated',
          isAuthenticated: true,
          user
        });

        const access_token = JSON.stringify(user);

        const responseBody = {
          user,
          access_token
        };

        const response = new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

        setAuthState({
          authStatus: 'authenticated',
          isAuthenticated: true,
          user
        });
        setTokenStorageValue(access_token);
        // setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });

        return response;
        /* const response = await authSignIn(credentials);
  
        const session = (await response.json()) as { user: User; access_token: string };
  
        if (session) {
          setAuthState({
            authStatus: 'authenticated',
            isAuthenticated: true,
            user: session.user
          });
          setTokenStorageValue(session.access_token);
          setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
        }
  
        return response; */
      },
      [setTokenStorageValue]
    );

    /**
     * Sign up
     */
    const signUp: JwtAuthContextType['signUp'] = useCallback(
      async (data: JwtSignUpPayload) => {
        const response = await authSignUp(data);

        const session = (await response.json()) as { user: User; access_token: string };

        if (session) {
          setAuthState({
            authStatus: 'authenticated',
            isAuthenticated: true,
            user: session.user
          });
          setTokenStorageValue(session.access_token);
          setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
        }

        return response;
      },
      [setTokenStorageValue]
    );

    /**
     * Sign out
     */
    const signOut: JwtAuthContextType['signOut'] = useCallback(() => {
      removeTokenStorageValue();
      removeGlobalHeaders(['Authorization']);
      setAuthState({
        authStatus: 'unauthenticated',
        isAuthenticated: false,
        user: null
      });
    }, [removeTokenStorageValue]);

    /**
     * Update user
     */
    const updateUser: JwtAuthContextType['updateUser'] = useCallback(async (_user) => {
      try {
        return await authUpdateDbUser(_user);
      } catch (error) {
        console.error('Error updating user:', error);
        return Promise.reject(error);
      }
    }, []);

    /**
     * Refresh access token
     */
    const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
      const response = await authRefreshToken();

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      return response;
    }, []);

    /**
     * Auth Context Value
     */
    const authContextValue = useMemo(
      () =>
        ({
          ...authState,
          signIn,
          signUp,
          signOut,
          updateUser,
          refreshToken
        }) as JwtAuthContextType,
      [authState, signIn, signUp, signOut, updateUser, refreshToken]
    );

    /**
     * Expose methods to the FuseAuthProvider
     */
    useImperativeHandle(ref, () => ({
      signOut,
      // updateUser
    }));

    /**
     * Intercept fetch requests to refresh the access token
     */
    const interceptFetch = useCallback(() => {
      const { fetch: originalFetch } = window;

      window.fetch = async (...args) => {
        const [resource, config] = args;
        const response = await originalFetch(resource, config);
        const newAccessToken = response.headers.get('New-Access-Token');

        if (newAccessToken) {
          setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` });
          setTokenStorageValue(newAccessToken);
        }

        if (response.status === 401) {
          signOut();

          console.error('Unauthorized request. User was signed out.');
        }

        return response;
      };
    }, [setTokenStorageValue, signOut]);

    useEffect(() => {
      if (authState.isAuthenticated) {
        interceptFetch();
      }
    }, [authState.isAuthenticated, interceptFetch]);

    return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
  }
);
export default JwtAuthProvider;
