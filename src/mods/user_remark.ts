import { $, $$, $H, append, attrs, create, html, observe } from '../utils/dom';
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
  verified: boolean;
}

interface IStatusContext {
  id: string;
  region_name: string;
  source: string;
  text: string;
  time: string;
  userInfo: IUserInfo;
}

interface IRetweetContext {
  data: {
    id: string;
    region_name: string;
    source: string;
    text: string;
    user: IUserInfo;
  };
}

const SPLITTEER = '<span style="border-right: 1px solid var(--w-off-border); margin: 0 0.5em;"></span>';

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
        'color': 'var(--w-sub)',
        'font-size': '80%',
        'font-weight': 'normal',
        'margin-left': '0.5em',
      },
      html: info.join(SPLITTEER),
    }));
  }
});

observe(document.body, function userRemark(): void {
  const reTextNames = $$<VueHTMLElement<IVNodeContext<IRetweetContext>>>(document, '.detail_reText_30vF1 > div > .woo-box-flex:not([awsl-infobox="yes"])');
  for (const container of reTextNames) {
    attrs(container, { 'awsl-infobox': 'yes' });

    const data = container.__vue__?.$vnode.context.data;
    if (!data) continue;

    const ctx = $H<{
      nick: HTMLElement;
      verify: HTMLElement;
    }>(container, {
      nick: '.detail_nick_u-ffy',
      verify: '.detail_verify_1GOx9',
    });
    if (!ctx) continue;

    html(ctx.nick, data.user.screen_name);
    if (!data.user.verified) {
      ctx.verify.remove();
    }

    const info: string[] = [];
    if (data.user.remark) {
      info.push(`备注：${data.user.remark}`);
    }
    if (data.user.follow_me) {
      info.push(data.user.following ? '互相关注' : '关注了我');
    }
    if (data.region_name) {
      info.push(data.region_name);
    }

    append(container, () => create('div', [], {
      style: {
        'color': 'var(--w-sub)',
        'font-size': '80%',
        'font-weight': 'normal',
        'margin-left': '0.5em',
      },
      html: info.join(SPLITTEER),
    }));
  }
});
