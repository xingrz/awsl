import { registerModule } from '@/module';
import { onMounted } from '@/hooks';
import { $, $H, append, create, html } from '@/utils/dom';

interface IFeedUser {
  remark: string;
  screen_name: string;
  follow_me: boolean;
  following: boolean;
  verified: boolean;
}

interface IFeedData {
  user: IFeedUser;
  region_name: string;
}

const SPLITTER = '<span style="border-right: 1px solid var(--w-off-border); margin: 0 0.5em;"></span>';

registerModule({
  id: 'user_remark',
  name: '优化用户备注显示',
  defaultEnabled: true,
  setup() {
    // 信息流一级作者
    onMounted('Feed', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el) return;

      const data = (instance.props as { data: IFeedData }).data;
      if (!data?.user) return;

      const ctx = $H<{
        nick: HTMLElement;
        name: HTMLElement;
      }>(el, {
        nick: '[class*="_nick_"]',
        name: '[class*="_nick_"] > [class*="_name_"] > span',
      });
      if (!ctx || $(ctx.nick, '.awsl-remark')) return;

      if (data.user.remark) {
        html(ctx.name, data.user.screen_name);
      }

      buildRemark(ctx.nick, data.user);
    });

    // 转发内容的原作者
    onMounted('FeedContent', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el || !el.classList.contains('retweet')) return;

      const data = (instance.props as { data: IFeedData }).data;
      if (!data?.user) return;

      const ctx = $H<{
        link: HTMLElement;
        name: HTMLElement;
      }>(el, {
        link: '.wbpro-feed-reText [usercard]',
        name: '.wbpro-feed-reText [usercard] > [class*="_nick_"]',
      });
      if (!ctx) return;

      const container = ctx.link.parentElement!;
      const verify = $(container, '[class*="_verify_"]');

      if ($(container, '.awsl-remark')) return;

      if (!data.user.verified && verify) {
        verify.remove();
      }

      if (data.user.remark) {
        html(ctx.name, data.user.screen_name);
      }

      buildRemark(container, data.user);
    });
  },
});

function buildRemark(container: HTMLElement, user: IFeedUser): void {
  const info: string[] = [];
  if (user.remark) {
    info.push(`备注：${user.remark}`);
  }
  if (user.follow_me) {
    info.push(user.following ? '互相关注' : '关注了我');
  }

  if (info.length > 0) {
    append(container, () => create('div', ['awsl-remark'], {
      style: {
        'color': 'var(--w-sub)',
        'font-size': '80%',
        'font-weight': 'normal',
        'margin-left': '0.5em',
      },
      html: info.join(SPLITTER),
    }));
  }
}
