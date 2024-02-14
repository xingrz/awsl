import { $, $$, $OR, bind, create, html, observe } from '../utils/dom';
import { INode, VueHTMLElement } from '../utils/vue';

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

interface IStatusItem {
  id: string;
  region_name: string;
  source: string;
  text: string;
  time: string;
  userInfo: IUserInfo;
}

observe(document.body, function userRemark(): void {
  const headNicks = $$(document, '.head_nick_1yix2');
  for (const headNick of headNicks) {
    const container = headNick as VueHTMLElement<INode<IStatusItem>>;

    const context = container.__vue__?.$vnode.context
    if (!context) continue;

    const headName = $(container, '.head_name_24eEB > span');
    if (!headName) continue;

    const infoBox = $OR(container, '.awsl-infobox', () => create('div', [
      'awsl-infobox',
    ], {
      style: {
        'color': '#999',
        'font-size': '80%',
        'font-weight': 'normal',
        'margin-left': '0.5em',
      },
    }));

    bind(container, 'awsl-infobox-id', context.id, () => {
      html(headName, context.userInfo.screen_name);

      const info: string[] = [];

      if (context.userInfo.remark) {
        info.push(`备注：${context.userInfo.remark}`);
      }

      if (context.userInfo.follow_me) {
        info.push('互相关注');
      }

      if (context.region_name) {
        info.push(context.region_name);
      }

      html(infoBox, info.join('&nbsp;|&nbsp;'));
    });
  }
});
