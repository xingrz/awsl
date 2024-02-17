import { $, $$, $H, append, attrs, create, html, insertBefore, observe } from '../utils/dom';
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
  transData: {
    id: string;
    region_name: string;
    source: string;
    text: string;
    user: IUserInfo;
  };
}

type IStatusElement = VueHTMLElement<IVNodeContext<IStatusContext>>;
type IRetweetElement = VueHTMLElement<IVNodeContext<IRetweetContext>>;

const SPLITTEER = '<span style="border-right: 1px solid var(--w-off-border); margin: 0 0.5em;"></span>';

observe(document.body, function userRemark(): void {
  for (const container of $$<IStatusElement>(document, '.head_content_wrap_27749:not([awsl-infobox="yes"])')) {
    attrs(container, { 'awsl-infobox': 'yes' });

    const context = container.__vue__?.$vnode.context
    if (!context) continue;

    const ctx = $H<{
      nick: HTMLElement;
      nickName: HTMLElement;
      from: HTMLElement;
    }>(container, {
      nick: '.head_nick_1yix2',
      nickName: '.head_name_24eEB > span',
      from: '.head-info_from_3FX0m > .woo-box-flex',
    });
    if (!ctx) continue;

    if (context.region_name) {
      const ip = $(ctx.from, '.head-info_ip_3ywCW');
      if (!ip) {
        const ip = create('div', ['head-info_ip_3ywCW'], {
          attrs: { title: context.region_name },
          html: context.region_name,
        });
        const source = $(ctx.from, '.head-info_source_2zcEX');
        if (source) {
          insertBefore(ctx.from, source, () => ip);
        } else {
          append(ctx.from, () => ip);
        }
      }
    }

    const info: string[] = [];
    if (context.userInfo.remark) {
      html(ctx.nickName, context.userInfo.screen_name);
      info.push(`备注：${context.userInfo.remark}`);
    }
    if (context.userInfo.follow_me) {
      info.push(context.userInfo.following ? '互相关注' : '关注了我');
    }

    append(ctx.nick, () => create('div', [], {
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
  for (const container of $$<IRetweetElement>(document, '.Feed_retweet_JqZJb:not([awsl-infobox="yes"])')) {
    attrs(container, { 'awsl-infobox': 'yes' });

    const data = container.__vue__?.$vnode.context.transData;
    if (!data) continue;

    const ctx = $H<{
      head: HTMLElement;
      headNick: HTMLElement;
      headVerify: HTMLElement;
      from: HTMLElement;
    }>(container, {
      head: '.detail_reText_30vF1 > div > .woo-box-flex',
      headNick: '.detail_nick_u-ffy',
      headVerify: '.detail_verify_1GOx9',
      from: '.head-info_from_3FX0m > .woo-box-flex',
    });
    if (!ctx) continue;

    if (data.region_name) {
      append(ctx.from, () => create('div', ['head-info_ip_3ywCW'], {
        attrs: { title: data.region_name },
        html: data.region_name,
      }));
    }
    if (data.source) {
      append(ctx.from, () => create('div', ['head-info_cut_1tPQI', 'head-info_source_2zcEX'], {
        html: `来自 ${data.source}`,
      }));
    }

    if (!data.user.verified) {
      ctx.headVerify.remove();
    }

    const info: string[] = [];
    if (data.user.remark) {
      html(ctx.headNick, data.user.screen_name);
      info.push(`备注：${data.user.remark}`);
    }
    if (data.user.follow_me) {
      info.push(data.user.following ? '互相关注' : '关注了我');
    }

    append(ctx.head, () => create('div', [], {
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
