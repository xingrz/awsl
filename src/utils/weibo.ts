import { $, ICreator, append, create, on } from './dom';

export interface IUserInfo {
  avatar_hd: string;
  avatar_large: string;
  cover_image_phone: string;
  description: string;
  domain: string;
  follow_me: boolean;
  followers_count: number;
  followers_count_str: string;
  following: boolean;
  friends_count: number;
  gender: string;
  id: number;
  idstr: string;
  location: string;
  profile_image_url: string;
  profile_url: string;
  screen_name: string;
  status_total_counter: {
    comment_cnt: string;
    like_cnt: string;
    repost_cnt: string;
    total_cnt: string;
    total_cnt_format: string;
  };
  statuses_count: number;
  svip: number;
  type: number;
  url: string;
  user_ability: number;
  user_limit: number;
  verified: boolean;
  verified_reason: string;
  verified_type: number;
  verified_type_ext: number;
};

export function createButton(text: string, type = 'default', classes: string[] = []): HTMLElement {
  return create('button', [
    ...classes,
    'woo-button-main',
    'woo-button-flat',
    `woo-button-${type}`,
    'woo-button-m',
    'woo-button-round',
  ], {}, [
    () => create('span', ['woo-button-wrap'], {}, [
      () => create('span', ['woo-button-content'], { html: text }),
    ]),
  ]);
}

export function createModal(title: string, content: (modal: HTMLElement) => ICreator<HTMLElement>[]): void {
  const app = $(document.body, '#app');
  if (!app) return;

  append(app, () => create('div', [
    'woo-box-flex',
    'woo-box-alignCenter',
    'woo-box-justifyCenter',
    'woo-modal-wrap',
  ], {}, [
    (modal) => create('div', ['woo-modal-main'], {}, [
      () => create('div', ['wbpro-layer'], {}, [
        () => create('div', ['woo-panel-main', 'woo-panel-bottom'], {}, [
          () => create('div', ['wbpro-layer-tit', 'woo-box-flex'], {}, [
            () => create('div', ['wbpro-layer-tit-text', 'woo-box-item-flex'], {
              style: { 'align-self': 'center' },
              html: title,
            }),
            () => {
              const close = create('div', [
                'wbpro-layer-tit-opt',
                'woo-box-flex',
                'woo-box-alignCenter',
                'woo-box-justifyCenter',
              ], {
                html: `<i class="woo-font woo-font--cross"></i>`,
              });
              return on(close, 'click', () => modal.remove());
            },
          ]),
        ]),
        ...content(modal),
      ]),
    ]),
    (modal) => {
      const mask = create('div', ['woo-modal-mask']);
      return on(mask, 'click', () => modal.remove());
    },
  ]));
}
