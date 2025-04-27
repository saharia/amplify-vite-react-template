import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import UseJwtAuth from 'src/@auth/services/jwt/useJwtAuth';
import FuseSvgIcon from 'src/@fuse/core/FuseSvgIcon';

/**
 * The sign in page.
 */
function SignInPage() {
  const { signIn } = UseJwtAuth();

  const handleTeacherLogin = () => {
    const payload = { email: '', password: ' ' };
    if (signIn) {
      signIn(payload);
    }
  }


  return (
    <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
      <Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
        <div className="flex mx-auto w-full max-w-80 sm:mx-0 sm:w-80 justify-center">
          <Button
            className=""
            variant="contained"
            color="secondary"
            onClick={handleTeacherLogin}
          >
            <FuseSvgIcon size={20}>heroicons-outline:user-circle</FuseSvgIcon>
            <span className="hidden sm:flex mx-2">Login Using Teacher</span>
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default SignInPage;
