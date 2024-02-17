import { $, $$, append, attrs, create, html, observe } from '../utils/dom';
import { IVNodeContext, VueHTMLElement } from '../utils/vue';

interface IUserInfo {
  avatar_hd: string;
  avatar_large: string;
  follow_me: boolean;
  following: boolean;
  id: number;
  idstr: string;
  profile_image_url: string;
  profile_url: string;
  remark: string;
  screen_name: string;
}

interface IStatusContext {
  id: string;
  region_name: string;
  source: string;
  text: string;
  time: string;
  userInfo: IUserInfo;
}

observe(document.body, function userRemark(): void {
  const headNicks = $$<VueHTMLElement<IVNodeContext<IStatusContext>>>(document, '.head_nick_1yix2:not([awsl-infobox="yes"])');
  for (const container of headNicks) {
    attrs(container, { 'awsl-infobox': 'yes' });

    const context = container.__vue__?.$vnode.context
    if (!context) continue;

    const headName = $(container, '.head_name_24eEB > span');
    if (!headName) continue;
    html(headName, context.userInfo.screen_name);

    const info: string[] = [];
    if (context.userInfo.remark) {
      info.push(`备注：${context.userInfo.remark}`);
    }
    if (context.userInfo.follow_me && context.userInfo.following) {
      info.push('互相关注');
    }
    if (context.region_name) {
      info.push(context.region_name);
    }

    append(container, () => create('div', [], {
      style: {
        'color': '#999',
        'font-size': '80%',
        'font-weight': 'normal',
        'margin-left': '0.5em',
      },
      html: info.join('&nbsp;|&nbsp;'),
    }));
  }
});
