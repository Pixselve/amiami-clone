// To parse this data:
//
//   import { Convert, AmiamiUtils } from "./file";
//
//   const amiAmiRequest = Convert.toAmiAmiRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AmiAmiRequest {
  RSuccess: boolean;
  RValue: null;
  RMessage: string;
  search_result: SearchResult;
  items: Item[];
  _embedded: Embedded;
}

export interface Embedded {
  category_tags: CategoryTag[];
  makers: CategoryTag[];
  series_titles: CategoryTag[];
  original_titles: CategoryTag[];
  character_names: CategoryTag[];
  elements: CategoryTag[];
}

export interface CategoryTag {
  id: number;
  name: string;
  count: number;
}

export interface Item {
  gcode: string;
  gname: string;
  thumb_url: string;
  thumb_alt: string;
  thumb_title: string;
  min_price: number;
  max_price: number;
  c_price_taxed: number;
  maker_name: string;
  saleitem: number;
  condition_flg: number;
  list_preorder_available: number;
  list_backorder_available: number;
  list_store_bonus: number;
  list_amiami_limited: number;
  instock_flg: number;
  order_closed_flg: number;
  element_id: null;
  salestatus: string;
  salestatus_detail: string;
  releasedate: string;
  jancode: null | string;
  preorderitem: number;
  saletopitem: number;
  resale_flg: number;
  preowned_sale_flg: null;
  for_women_flg: number;
  genre_moe: number;
  cate6: null;
  cate7: null;
  buy_flg: number;
  buy_price: number;
  buy_remarks: null;
  stock_flg: number;
  image_on: number;
  image_category: string;
  image_name: string;
  metaalt: null;
}

export interface SearchResult {
  total_results: number;
}


export interface FetchAmiAmiParams {
  pagemax?: number
  s_keywords?: string
  pagecnt?: number
  s_cate_tag?: number
  s_originaltitle_id?: number
  s_charaname_search_id?: number
  s_maker_id?: number
  s_seriestitle_id?: number
  s_sortkey?: string
  s_st_condition_flg?: number
}

export async function fetchAmiAmi(params: FetchAmiAmiParams, fetchFunction: typeof fetch = fetch): Promise<AmiAmiRequest> {
  if (fetchFunction instanceof Function) {
    const body = new URLSearchParams();
    for (let paramsKey in params) {
      if (params.hasOwnProperty(paramsKey)) {
        if (typeof params[paramsKey] === 'string' && params[paramsKey].length > 0) {
          body.append(paramsKey, params[paramsKey]);
        } else if (typeof params[paramsKey] === 'number' && params[paramsKey] >= 0) {
          body.append(paramsKey, params[paramsKey]);
        }
      }
    }
    const response = await fetchFunction(`https://api-amiami.maelkerichard.com/`, {
      method: 'POST',
      body,
    });
    return await response.json();
  }

}
