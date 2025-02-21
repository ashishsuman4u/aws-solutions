import { redirect } from 'next/navigation';
import { signUp, confirmSignUp, signIn, signOut, resendSignUpCode, getCurrentUser } from 'aws-amplify/auth';
import { getErrorMessage } from '@/utils/get-error-message';

export async function handleSignUp(prevState: string | undefined, formData: FormData) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.get('email')),
      password: String(formData.get('password')),
      options: {
        userAttributes: {
          email: String(formData.get('email')),
        },
        // optional
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect('/auth/confirm-signup');
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get('email')),
    });
    currentState = {
      ...prevState,
      message: 'Code sent successfully',
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(prevState: string | undefined, formData: FormData) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get('email')),
      confirmationCode: String(formData.get('code')),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect('/auth/login');
}

export async function handleSignIn(username: string, password: string) {
  let redirectLink = '/upload';
  try {
    const { isSignedIn, nextStep } = await signIn({
      username,
      password,
    });
    if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
      await resendSignUpCode({
        username,
      });
      redirectLink = '/auth/confirm-signup';
    }
  } catch (error) {
    return getErrorMessage(error);
  }

  redirect(redirectLink);
}

export async function getLoggedInUser() {
  try {
    return await getCurrentUser();
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log(getErrorMessage(error));
  }
  redirect('/');
}
