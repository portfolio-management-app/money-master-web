import { action, makeAutoObservable, observable } from 'mobx';
import { UserInfo } from 'shared/models';
import { getRandomAvatarColor } from 'utils';

class UserStore {
  user: UserInfo | null = null;
  constructor() {
    makeAutoObservable(this, {
      user: observable,
      updateUser: action,
    });
  }

  getUser(): UserInfo | null {
    return this.user;
  }

  updateUser(newUser: UserInfo) {
    this.user = new UserInfo(newUser);
    this.user.backgroundColor = getRandomAvatarColor();
  }

  deleteUser() {
    this.user = null;
  }
}

export const userStore = new UserStore();
