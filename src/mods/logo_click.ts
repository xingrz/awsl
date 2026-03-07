import type { Router } from 'vue-router';
import type { Store } from 'vuex';
import { registerModule } from '@/module';
import { onInit } from '@/hooks';
import { $, attrs, on } from '@/utils/dom';

interface IFeedGroup {
  gid: string;
  name: string;
}

interface IFeedState {
  feed: {
    feedGroup: {
      left?: IFeedGroup[];
    };
  };
  config: {
    config: {
      uid: number;
    };
  };
}

registerModule({
  id: 'logo_click',
  name: '点击 LOGO 进入「最新微博」',
  defaultEnabled: true,
  setup() {
    onInit((app) => {
      const { $router, $store, $Bus } = app.config.globalProperties as unknown as {
        $router: Router;
        $store: Store<IFeedState>;
        $Bus: { $emit: (event: string, ...args: unknown[]) => void };
      };

      const uid = $store.state.config?.config?.uid;
      if (!uid) return;

      const logo = $<HTMLAnchorElement>(document, 'a[class*="_logoWrap"]');
      if (!logo) return;

      attrs(logo, { 'href': `/mygroups?gid=11000${uid}` });

      on(logo, 'click', (e) => {
        e.preventDefault();

        $router.push({
          name: 'mygroups',
          query: { gid: `11000${uid}` },
        });

        const left = $store.state.feed.feedGroup.left;
        if (left) {
          const curIndex = 1;
          const navItem = left[curIndex];
          $Bus.$emit('handleHomeNav', navItem, curIndex, 'left');
        }
      });
    });
  },
});
