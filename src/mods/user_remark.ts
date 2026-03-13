import { registerModule } from '@/module';
import { onMounted } from '@/hooks';
import { $, $H, append, create, html } from '@/utils/dom';
import type { IFeed, IUser } from '@/utils/weibo';

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

      const data = (instance.props as { data: IFeed }).data;
      if (!data?.user) return;

      const ctx = $H<{
        nick: HTMLElement;
        name: HTMLElement;
      }>(el, {
        nick: '[class*="_nick_"]',
        name: '[class*="_nick_"] > [class*="_name_"] > span',
      });
      if (!ctx || $(ctx.nick, '.awsl-user-remark')) return;

      if (data.user.remark) {
        html(ctx.name, data.user.screen_name);
      }

      buildRemark(ctx.nick, data.user);
    });

    // 快转
    onMounted('Feed', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el) return;

      const data = (instance.props as { data: IFeed }).data;
      if (!data?.user) return;

      const ctx = $H<{
        name: HTMLElement;
        suffix: HTMLElement;
      }>(el, {
        name: '[class*="_fastfront_"] > span',
        suffix: '[class*="_fastbehind_"]',
      });
      if (!ctx) return;

      const container = ctx.suffix.parentElement;
      if (!container || $(container, '.awsl-user-remark')) return;

      if (data.user.remark) {
        html(ctx.name, data.user.screen_name);
      }

      buildRemark(container, data.user);

      ctx.suffix.remove();
    });

    // 转发内容的原作者
    onMounted('FeedContent', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el || !el.classList.contains('retweet')) return;

      const data = (instance.props as { data: IFeed }).data;
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

      if ($(container, '.awsl-user-remark')) return;

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

function buildRemark(container: HTMLElement, user: IUser): void {
  const info: string[] = [];
  if (user.remark) {
    info.push(`备注：${user.remark}`);
  }
  if (user.follow_me) {
    info.push(user.following ? '互相关注' : '关注了我');
  }

  if (info.length > 0) {
    append(container, () => create('div', ['awsl-user-remark'], {
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
