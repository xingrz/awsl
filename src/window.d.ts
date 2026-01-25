import type { IUserInfo } from '@/utils/weibo';

interface window {
  $CONFIG: {
    uid: number;
    user: IUserInfo;
  };
}
