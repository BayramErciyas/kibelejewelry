// Görünen içerikleri templates/*.html içinde düzenleyin.
import shell from "../templates/storefront.html?raw";
import productList from "../templates/product-list.html?raw";
import collectionLayout from "../templates/collection.html?raw";
import materialsContent from "../templates/materials.html?raw";
import worldContent from "../templates/our-world.html?raw";
import regionPanel from "../templates/region-panel.html?raw";
import accountContent from "../templates/account.html?raw";
import { createPageRenderer } from "./page-renderer.js";
export const storefrontPages = createPageRenderer({
  shell: shell.replace("<!-- REGION_PANEL -->", regionPanel),
  accountContent,
  productList,
  collectionLayout,
  materialsContent,
  worldContent,
});
export default storefrontPages.home;
