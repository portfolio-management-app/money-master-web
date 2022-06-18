import { httpService } from '../../services/http-service';
import { action, observable, runInAction } from 'mobx';
import { makeAutoObservable } from 'mobx';
import { RPFormContants } from 'shared/constants';

class AccountStore {
  currentForm: string = RPFormContants.sendEmail;
  email: string = '';
  constructor() {
    makeAutoObservable({
      currentForm: observable,
      email: observable,

      setNextForm: action,
      setEmail: action,
      sendEmail: action,
      verifyOTPCode: action,
      resetNewPassword: action,
      resetInitialState: action,
    });
  }

  setNextForm(type: string) {
    this.currentForm = type;
  }

  setEmail(email: string) {
    this.email = email;
  }

  async sendEmail(payload: { email: string; lang: string }) {
    const url = '/account/forgetPassword';
    const res: { isError: boolean; data: any } = await httpService.post(
      url,
      payload,
    );
    if (!res.isError) {
      runInAction(() => {
        this.email = res.data.email;
      });
    } else {
    }
    return res;
  }

  async verifyOTPCode(payload: { otpCode: string; email: string }) {
    const url = '/account/otp';
    const res: { isError: boolean; data: any } = await httpService.post(
      url,
      payload,
    );
    return res;
  }

  async resetNewPassword(payload: { email: string; newPassword: string }) {
    const url = '/account/resetPassword';
    const res: { isError: boolean; data: any } = await httpService.post(
      url,
      payload,
    );
    return res;
  }

  resetInitialState() {
    this.currentForm = RPFormContants.sendEmail;
    this.email = '';
  }
}

export const accountStore = new AccountStore();
