import { registerModule } from '@/module';
import { onMounted } from '@/hooks';
import { $, append, create, html } from '@/utils/dom';

interface IFeedUser {
  remark: string;
  screen_name: string;
  follow_me: boolean;
  following: boolean;
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
    onMounted('Feed', (instance) => {
      const el = instance.vnode.el as HTMLElement | null;
      if (!el) return;

      const data = (instance.props as { data: IFeedData }).data;
      if (!data?.user) return;

      const nick = $<HTMLElement>(el, '[class*="_nick_"]');
      if (!nick || nick.querySelector('.awsl-remark')) return;

      const nameLink = $<HTMLElement>(nick, 'a[class*="_name_"]');
      const nameSpan = nameLink?.querySelector('span');

      const info: string[] = [];
      if (data.user.remark && nameSpan) {
        html(nameSpan, data.user.screen_name);
        info.push(`备注：${data.user.remark}`);
      }
      if (data.user.follow_me) {
        info.push(data.user.following ? '互相关注' : '关注了我');
      }

      if (info.length > 0) {
        append(nick, () => create('div', ['awsl-remark'], {
          style: {
            'color': 'var(--w-sub)',
            'font-size': '80%',
            'font-weight': 'normal',
            'margin-left': '0.5em',
          },
          html: info.join(SPLITTER),
        }));
      }
    });
  },
});
