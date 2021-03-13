// To parse this data:
//
//   import { Convert, AmiamiUtils } from "./file";
//
//   const amiAmiRequest = Convert.toAmiAmiRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AmiAmiRequest {
  RSuccess:      boolean;
  RValue:        null;
  RMessage:      string;
  search_result: SearchResult;
  items:         Item[];
  _embedded:     Embedded;
}

export interface Embedded {
  category_tags:   CategoryTag[];
  makers:          CategoryTag[];
  series_titles:   CategoryTag[];
  original_titles: CategoryTag[];
  character_names: CategoryTag[];
  elements:        CategoryTag[];
}

export interface CategoryTag {
  id:    number;
  name:  string;
  count: number;
}

export interface Item {
  gcode:                    string;
  gname:                    string;
  thumb_url:                string;
  thumb_alt:                string;
  thumb_title:              string;
  min_price:                number;
  max_price:                number;
  c_price_taxed:            number;
  maker_name:               string;
  saleitem:                 number;
  condition_flg:            number;
  list_preorder_available:  number;
  list_backorder_available: number;
  list_store_bonus:         number;
  list_amiami_limited:      number;
  instock_flg:              number;
  order_closed_flg:         number;
  element_id:               null;
  salestatus:               string;
  salestatus_detail:        string;
  releasedate:              string;
  jancode:                  null | string;
  preorderitem:             number;
  saletopitem:              number;
  resale_flg:               number;
  preowned_sale_flg:        null;
  for_women_flg:            number;
  genre_moe:                number;
  cate6:                    null;
  cate7:                    null;
  buy_flg:                  number;
  buy_price:                number;
  buy_remarks:              null;
  stock_flg:                number;
  image_on:                 number;
  image_category:           string;
  image_name:               string;
  metaalt:                  null;
}

export interface SearchResult {
  total_results: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toAmiAmiRequest(json: string): AmiAmiRequest {
    return cast(JSON.parse(json), r("AmiamiUtils"));
  }

  public static amiAmiRequestToJson(value: AmiAmiRequest): string {
    return JSON.stringify(uncast(value, r("AmiamiUtils")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "AmiAmiRequest": o([
    { json: "RSuccess", js: "RSuccess", typ: true },
    { json: "RValue", js: "RValue", typ: null },
    { json: "RMessage", js: "RMessage", typ: "" },
    { json: "search_result", js: "search_result", typ: r("SearchResult") },
    { json: "items", js: "items", typ: a(r("Item")) },
    { json: "_embedded", js: "_embedded", typ: r("Embedded") },
  ], false),
  "Embedded": o([
    { json: "category_tags", js: "category_tags", typ: a(r("CategoryTag")) },
    { json: "makers", js: "makers", typ: a(r("CategoryTag")) },
    { json: "series_titles", js: "series_titles", typ: a(r("CategoryTag")) },
    { json: "original_titles", js: "original_titles", typ: a(r("CategoryTag")) },
    { json: "character_names", js: "character_names", typ: a(r("CategoryTag")) },
    { json: "elements", js: "elements", typ: a(r("CategoryTag")) },
  ], false),
  "CategoryTag": o([
    { json: "id", js: "id", typ: 0 },
    { json: "name", js: "name", typ: "" },
    { json: "count", js: "count", typ: 0 },
  ], false),
  "Item": o([
    { json: "gcode", js: "gcode", typ: "" },
    { json: "gname", js: "gname", typ: "" },
    { json: "thumb_url", js: "thumb_url", typ: "" },
    { json: "thumb_alt", js: "thumb_alt", typ: "" },
    { json: "thumb_title", js: "thumb_title", typ: "" },
    { json: "min_price", js: "min_price", typ: 0 },
    { json: "max_price", js: "max_price", typ: 0 },
    { json: "c_price_taxed", js: "c_price_taxed", typ: 0 },
    { json: "maker_name", js: "maker_name", typ: "" },
    { json: "saleitem", js: "saleitem", typ: 0 },
    { json: "condition_flg", js: "condition_flg", typ: 0 },
    { json: "list_preorder_available", js: "list_preorder_available", typ: 0 },
    { json: "list_backorder_available", js: "list_backorder_available", typ: 0 },
    { json: "list_store_bonus", js: "list_store_bonus", typ: 0 },
    { json: "list_amiami_limited", js: "list_amiami_limited", typ: 0 },
    { json: "instock_flg", js: "instock_flg", typ: 0 },
    { json: "order_closed_flg", js: "order_closed_flg", typ: 0 },
    { json: "element_id", js: "element_id", typ: null },
    { json: "salestatus", js: "salestatus", typ: "" },
    { json: "salestatus_detail", js: "salestatus_detail", typ: "" },
    { json: "releasedate", js: "releasedate", typ: "" },
    { json: "jancode", js: "jancode", typ: u(null, "") },
    { json: "preorderitem", js: "preorderitem", typ: 0 },
    { json: "saletopitem", js: "saletopitem", typ: 0 },
    { json: "resale_flg", js: "resale_flg", typ: 0 },
    { json: "preowned_sale_flg", js: "preowned_sale_flg", typ: null },
    { json: "for_women_flg", js: "for_women_flg", typ: 0 },
    { json: "genre_moe", js: "genre_moe", typ: 0 },
    { json: "cate6", js: "cate6", typ: null },
    { json: "cate7", js: "cate7", typ: null },
    { json: "buy_flg", js: "buy_flg", typ: 0 },
    { json: "buy_price", js: "buy_price", typ: 0 },
    { json: "buy_remarks", js: "buy_remarks", typ: null },
    { json: "stock_flg", js: "stock_flg", typ: 0 },
    { json: "image_on", js: "image_on", typ: 0 },
    { json: "image_category", js: "image_category", typ: "" },
    { json: "image_name", js: "image_name", typ: "" },
    { json: "metaalt", js: "metaalt", typ: null },
  ], false),
  "SearchResult": o([
    { json: "total_results", js: "total_results", typ: 0 },
  ], false),
};
