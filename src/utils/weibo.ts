import { $, ICreator, append, create, on } from './dom';

export interface IUser {
  avatar_hd: string;
  avatar_large: string;
  domain: string;
  follow_me: boolean;
  following: boolean;
  id: number;
  idstr: string;
  is_special_attention: boolean;
  mbrank: number;
  mbtype: number;
  pc_new: number;
  planet_video: boolean;
  profile_image_url: string;
  profile_url: string;
  remark: string;
  screen_name: string;
  status_total_counter: {
    comment_cnt: string;
    like_cnt: string;
    repost_cnt: string;
    total_cnt: string;
    total_cnt_format: string;
  };
  user_ability: number;
  v_plus: number;
  verified: boolean;
  verified_type: number;
  verified_type_ext: number;
  weihao: string;
}

export interface IFeed {
  analysis_extra: string;
  attitudes_count: number;
  attitudes_status: number;
  can_edit: boolean;
  comments_count: number;
  content_auth: number;
  created_at: string; // "Mon Mar 09 13:38:22 +0800 2026"
  favorited: boolean;
  id: number;
  idstr: string;
  isAd: boolean;
  isLongText: boolean;
  isSinglePayAudio: boolean;
  is_controlled_by_server: string;
  is_paid: boolean;
  is_show_bulletin: number;
  is_show_mixed: boolean;
  mblog_vip_type: number;
  mblogid: string;
  mblogtype: number;
  mid: string;
  mixed_count: number;
  mlevel: number;
  pc_bg_new: string;
  pic_ids: string[];
  pic_infos?: Record<string, {
    bmiddle: IPictureInfo;
    focus_point: { left: number; top: number; width: number; height: number; };
    large: IPictureInfo;
    largecover: IPictureInfo;
    largest: IPictureInfo;
    mw2000: IPictureInfo;
    object_id: string;
    original: IPictureInfo;
    photo_tag: number;
    pid_id: string;
    pic_status: number;
    thumbnail: IPictureInfo;
    type: string;
  }>;
  pic_num: number;
  pictureViewerSign: boolean;
  readtimetype: string;
  region_name: string;
  repost_type: number;
  reposts_count: number;
  retweeted_status?: IFeed;
  rid: string;
  share_repost_type: number;
  showFeedComment: boolean;
  showFeedRepost: boolean;
  showPictureViewer: boolean;
  source: string;
  text: string;
  text_raw: string;
  user: IUser;
  visible: {
    type: number;
    list_id: number;
  };
}

export interface IPictureInfo {
  url: string;
  width: number;
  height: number;
  cut_type: number;
}

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
