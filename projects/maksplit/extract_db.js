/**
 * extract_db.js — Parse WordPress WooCommerce SQL dump and extract structured data.
 * Usage: node extract_db.js [sql_dump_path] [output_dir]
 */

const fs = require('fs');
const path = require('path');

const SQL_PATH = process.argv[2] || 'D:/Anna/Сайты/maksplit.ru/maksplit_db.sql';
const OUT_DIR = process.argv[3] || 'D:/pi/projects/maksplit';

// ====== SQL Value Parser ======
// Handles escaped quotes, multi-line strings, nested parentheses in serialized data

function parseSqlValues(sql) {
  // Find the VALUES keyword and get everything after it
  const valuesIdx = sql.indexOf('VALUES');
  if (valuesIdx === -1) return [];
  
  // Get the values part (after VALUES keyword)
  let valuesPart = sql.slice(valuesIdx + 6).trim();
  
  const rows = [];
  let i = 0;
  
  while (i < valuesPart.length) {
    if (valuesPart[i] === '(') {
      const row = [];
      i++; // skip opening (
      let field = '';
      let inString = false;
      let depth = 0; // for nested parentheses
      
      while (i < valuesPart.length) {
        const ch = valuesPart[i];
        const next = i + 1 < valuesPart.length ? valuesPart[i + 1] : '';
        
        if (inString) {
          if (ch === '\\' && next) {
            // SQL escape sequence
            if (next === "'" || next === '"' || next === '\\') {
              field += next;
              i += 2;
              continue;
            } else if (next === 'r') {
              field += '\r';
              i += 2;
              continue;
            } else if (next === 'n') {
              field += '\n';
              i += 2;
              continue;
            } else if (next === 't') {
              field += '\t';
              i += 2;
              continue;
            }
            field += ch;
            i++;
            continue;
          }
          if (ch === "'" && next === "'") {
            // Escaped quote ''
            field += "'";
            i += 2;
            continue;
          }
          if (ch === "'") {
            inString = false;
            row.push(field);
            field = '';
            i++;
            // Expect comma or closing paren
            while (i < valuesPart.length && (valuesPart[i] === ' ' || valuesPart[i] === '\n' || valuesPart[i] === '\r' || valuesPart[i] === '\t')) i++;
            if (valuesPart[i] === ',') {
              i++;
              while (i < valuesPart.length && (valuesPart[i] === ' ' || valuesPart[i] === '\n' || valuesPart[i] === '\r' || valuesPart[i] === '\t')) i++;
            }
            continue;
          }
          field += ch;
          i++;
          continue;
        }
        
        if (ch === "'") {
          inString = true;
          i++;
          continue;
        }
        
        if (ch === '(') {
          depth++;
          field += ch;
          i++;
          continue;
        }
        
        if (ch === ')') {
          if (depth > 0) {
            depth--;
            field += ch;
            i++;
            continue;
          }
          // End of row
          if (field !== '' || row.length > 0) {
            // Push the last field
            const trimmed = field.trim();
            if (trimmed === 'NULL') {
              row.push(null);
            } else {
              row.push(trimmed);
            }
          }
          rows.push(row);
          i++;
          // Skip comma or semicolon
          while (i < valuesPart.length && (valuesPart[i] === ' ' || valuesPart[i] === '\n' || valuesPart[i] === '\r' || valuesPart[i] === '\t')) i++;
          if (valuesPart[i] === ',') {
            i++;
            while (i < valuesPart.length && (valuesPart[i] === ' ' || valuesPart[i] === '\n' || valuesPart[i] === '\r' || valuesPart[i] === '\t')) i++;
          }
          break;
        }
        
        if (ch === ',') {
          if (depth > 0) {
            field += ch;
            i++;
            continue;
          }
          const trimmed = field.trim();
          if (trimmed === 'NULL') {
            row.push(null);
          } else {
            row.push(trimmed);
          }
          field = '';
          i++;
          while (i < valuesPart.length && (valuesPart[i] === ' ' || valuesPart[i] === '\n' || valuesPart[i] === '\r' || valuesPart[i] === '\t')) i++;
          continue;
        }
        
        field += ch;
        i++;
      }
    } else {
      i++;
    }
  }
  
  return rows;
}

// ====== Collect INSERT blocks ======
function collectInsertRows(filePath, tableName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const rows = [];
  let inBlock = false;
  let blockSql = '';
  let blockEnded = false;
  
  for (const line of lines) {
    if (line.startsWith(`INSERT INTO \`${tableName}\``)) {
      inBlock = true;
      blockSql = line;
      blockEnded = line.trimEnd().endsWith(';');
      if (blockEnded) {
        const parsed = parseSqlValues(blockSql);
        rows.push(...parsed);
        inBlock = false;
      }
      continue;
    }
    
    if (inBlock) {
      blockSql += '\n' + line;
      blockEnded = line.trimEnd().endsWith(';');
      if (blockEnded) {
        const parsed = parseSqlValues(blockSql);
        rows.push(...parsed);
        inBlock = false;
      }
    }
  }
  
  return rows;
}

// ====== Main extraction ======
console.log(`Reading SQL dump: ${SQL_PATH}`);

// 1. Collect posts
console.log('Collecting wps_posts...');
const postsRows = collectInsertRows(SQL_PATH, 'wps_posts');
console.log(`  Total posts: ${postsRows.length}`);

// 2. Collect postmeta
console.log('Collecting wps_postmeta...');
const postmetaRows = collectInsertRows(SQL_PATH, 'wps_postmeta');
console.log(`  Total postmeta: ${postmetaRows.length}`);

// 3. Collect terms
console.log('Collecting wps_terms...');
const termsRows = collectInsertRows(SQL_PATH, 'wps_terms');
console.log(`  Total terms: ${termsRows.length}`);

// 4. Collect term_taxonomy
console.log('Collecting wps_term_taxonomy...');
const termTaxRows = collectInsertRows(SQL_PATH, 'wps_term_taxonomy');
console.log(`  Total term_taxonomy: ${termTaxRows.length}`);

// 5. Collect term_relationships
console.log('Collecting wps_term_relationships...');
const termRelRows = collectInsertRows(SQL_PATH, 'wps_term_relationships');
console.log(`  Total term_relationships: ${termRelRows.length}`);

// ====== Build indexes ======
// wps_posts columns: ID, post_author, post_date, post_date_gmt, post_content, post_title,
//   post_excerpt, post_status, comment_status, ping_status, post_password, post_name,
//   to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered,
//   post_parent, guid, menu_order, post_type, post_mime_type, comment_count
const postsMap = new Map(); // post_id -> post object
for (const row of postsRows) {
  const id = parseInt(row[0]);
  postsMap.set(id, {
    id,
    author: parseInt(row[1]),
    date: row[2],
    date_gmt: row[3],
    content: row[4] || '',
    title: row[5] || '',
    excerpt: row[6] || '',
    status: row[7],
    comment_status: row[8],
    ping_status: row[9],
    password: row[10] || '',
    slug: row[11] || '',
    to_ping: row[12] || '',
    pinged: row[13] || '',
    modified: row[14],
    modified_gmt: row[15],
    content_filtered: row[16] || '',
    parent: parseInt(row[17]),
    guid: row[18] || '',
    menu_order: parseInt(row[19]),
    type: row[20],
    mime_type: row[21] || '',
    comment_count: parseInt(row[22]),
  });
}

// ====== Build attachment URL map ======
// Combine _wp_attached_file from postmeta with post_title/post_excerpt from attachment posts
const BASE_UPLOADS_URL = 'https://maksplit.ru/wp-content/uploads/';
const attachmentMap = new Map(); // attachment_id -> {url, alt, title}

// Index attachment posts (post_type='attachment') by ID
const attachmentPosts = new Map();
for (const row of postsRows) {
  if (row[20] === 'attachment') {
    const id = parseInt(row[0]);
    attachmentPosts.set(id, {
      id,
      title: row[5] || '',
      excerpt: row[6] || '',
    });
  }
}
console.log(`  Attachment posts: ${attachmentPosts.size}`);

// wps_postmeta columns: meta_id, post_id, meta_key, meta_value
const postmetaMap = new Map(); // post_id -> { meta_key: meta_value }
for (const row of postmetaRows) {
  const postId = parseInt(row[1]);
  const key = row[2];
  const value = row[3];
  if (!postmetaMap.has(postId)) {
    postmetaMap.set(postId, new Map());
  }
  postmetaMap.get(postId).set(key, value);
}

// ====== Build attachment URL map ======
// Combine _wp_attached_file from postmeta with post_title/post_excerpt from attachment posts
let attachmentsWithFile = 0;
let attachmentsWithoutFile = 0;
for (const [postId, meta] of postmetaMap) {
  const filePath = meta.get('_wp_attached_file');
  if (filePath && filePath !== '') {
    const attachment = attachmentPosts.get(postId);
    if (attachment) {
      attachmentMap.set(postId, {
        id: postId,
        url: BASE_UPLOADS_URL + filePath,
        alt: attachment.excerpt || attachment.title || '',
        title: attachment.title || '',
      });
      attachmentsWithFile++;
    }
  } else if (attachmentPosts.has(postId)) {
    attachmentsWithoutFile++;
  }
}
console.log(`  Attachments with file: ${attachmentsWithFile}, without file: ${attachmentsWithoutFile}`);

// wps_terms columns: term_id, name, slug, term_group
const termsMap = new Map(); // term_id -> {name, slug}
for (const row of termsRows) {
  const id = parseInt(row[0]);
  termsMap.set(id, {
    id,
    name: row[1] || '',
    slug: row[2] || '',
    group: parseInt(row[3]),
  });
}

// wps_term_taxonomy columns: term_taxonomy_id, term_id, taxonomy, description, parent, count
const termTaxMap = new Map(); // term_taxonomy_id -> taxonomy info
const termsByTaxonomy = new Map(); // taxonomy -> [{term_taxonomy_id, term_id, ...}]
for (const row of termTaxRows) {
  const ttId = parseInt(row[0]);
  const termId = parseInt(row[1]);
  const taxonomy = row[2];
  const info = {
    tt_id: ttId,
    term_id: termId,
    taxonomy,
    description: row[3] || '',
    parent: parseInt(row[4]),
    count: parseInt(row[5]),
  };
  termTaxMap.set(ttId, info);
  if (!termsByTaxonomy.has(taxonomy)) {
    termsByTaxonomy.set(taxonomy, []);
  }
  termsByTaxonomy.get(taxonomy).push(info);
}

// wps_term_relationships columns: object_id, term_taxonomy_id, term_order
const termRelMap = new Map(); // object_id -> [term_taxonomy_id]
for (const row of termRelRows) {
  const objId = parseInt(row[0]);
  const ttId = parseInt(row[1]);
  if (!termRelMap.has(objId)) {
    termRelMap.set(objId, []);
  }
  termRelMap.get(objId).push(ttId);
}

// ====== Extract products ======
console.log('\nExtracting products...');
// Include all statuses except auto-draft and trash
const productPosts = postsRows.filter(r => r[20] === 'product' && r[7] !== 'auto-draft' && r[7] !== 'trash');
console.log(`  Found ${productPosts.length} products (all statuses except auto-draft/trash)`);

const products = [];
for (const row of productPosts) {
  const id = parseInt(row[0]);
  const meta = postmetaMap.get(id) || new Map();
  
  // Get thumbnail + gallery with URLs
  const thumbnailId = meta.get('_thumbnail_id') ? parseInt(meta.get('_thumbnail_id')) : null;
  const galleryStr = meta.get('_product_image_gallery') || '';
  
  // Build gallery array with URLs
  const gallery = [];
  const seenIds = new Set();
  
  // Featured image first
  if (thumbnailId) {
    const att = attachmentMap.get(thumbnailId);
    if (att) {
      gallery.push({ id: att.id, url: att.url, alt: att.alt });
      seenIds.add(att.id);
    }
  }
  // Then gallery images (skip duplicates)
  if (galleryStr) {
    const extraIds = galleryStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    for (const gid of extraIds) {
      if (!seenIds.has(gid)) {
        const att = attachmentMap.get(gid);
        if (att) {
          gallery.push({ id: att.id, url: att.url, alt: att.alt });
          seenIds.add(att.id);
        }
      }
    }
  }
  
  // Featured image (separate field for convenience)
  const featuredImage = thumbnailId ? attachmentMap.get(thumbnailId) || null : null;
  const featured_image = featuredImage ? { id: featuredImage.id, url: featuredImage.url, alt: featuredImage.alt } : null;
  
  // Get SKU
  const sku = meta.get('_sku') || null;
  
  // Get price
  const price = meta.get('_price') || null;
  const regularPrice = meta.get('_regular_price') || null;
  const salePrice = meta.get('_sale_price') || null;
  
  // Get stock
  const stockStatus = meta.get('_stock_status') || null;
  const manageStock = meta.get('_manage_stock') || null;
  const stockQty = meta.get('_stock') || null;
  
  // Check if variable
  // Find variations (children of this product)
  const variations = postsRows.filter(r => r[20] === 'product_variation' && parseInt(r[17]) === id);
  const isVariable = variations.length > 0;
  
  // Get category
  let category = null;
  const rels = termRelMap.get(id) || [];
  for (const ttId of rels) {
    const tax = termTaxMap.get(ttId);
    if (tax && tax.taxonomy === 'product_cat') {
      const term = termsMap.get(tax.term_id);
      if (term) {
        category = term.name;
      }
    }
  }
  
  // Get product attributes from variations
  const attrMap = {};
  for (const v of variations) {
    const vId = parseInt(v[0]);
    const vMeta = postmetaMap.get(vId) || new Map();
    for (const [key, value] of vMeta) {
      if (key.startsWith('attribute_')) {
        let attrName = key.replace('attribute_', '').replace(/^pa_/, '');
        // URL-decode attribute names (e.g. %d1%86%d0%b2%d0%b5%d1%82 -> цвет)
        try {
          attrName = decodeURIComponent(attrName);
        } catch (e) { /* keep as-is */ }
        if (!attrMap[attrName]) {
          attrMap[attrName] = new Set();
        }
        attrMap[attrName].add(value);
      }
    }
  }
  const attributes = Object.entries(attrMap).map(([name, options]) => ({
    name,
    options: [...options],
  }));
  
  // Compute price range from variations
  let priceRange = null;
  if (isVariable) {
    const prices = [];
    for (const v of variations) {
      const vId = parseInt(v[0]);
      const vMeta = postmetaMap.get(vId) || new Map();
      const vPrice = vMeta.get('_price');
      if (vPrice) {
        prices.push(parseFloat(vPrice));
      }
    }
    if (prices.length > 0) {
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      if (minP === maxP) {
        priceRange = `${minP} ₽`;
      } else {
        priceRange = `${minP} ₽ – ${maxP} ₽`;
      }
    }
  } else {
    priceRange = price ? `${price} ₽` : null;
  }
  
  products.push({
    id,
    slug: row[11] || '',
    title: row[5] || '',
    short_description: row[6] || '',
    full_description: row[4] || '',
    price_range: priceRange,
    regular_price: regularPrice,
    sale_price: salePrice,
    stock_status: stockStatus,
    stock_quantity: stockQty ? parseInt(stockQty) : null,
    gallery,
    featured_image,
    category,
    attributes,
    is_variable: isVariable,
    sku,
    variation_count: variations.length,
  });
}

console.log(`  Extracted ${products.length} products`);

// ====== Extract variations ======
console.log('\nExtracting variations...');
const variationPosts = postsRows.filter(r => r[20] === 'product_variation' && r[7] !== 'auto-draft' && r[7] !== 'trash');
console.log(`  Found ${variationPosts.length} variations (all statuses except auto-draft/trash)`);

const variations = [];
for (const row of variationPosts) {
  const id = parseInt(row[0]);
  const parentId = parseInt(row[17]);
  const meta = postmetaMap.get(id) || new Map();
  
  // Get parent slug
  const parent = postsMap.get(parentId);
  const parentSlug = parent ? parent.slug : '';
  
  // Get attributes
  const attrs = {};
  for (const [key, value] of meta) {
    if (key.startsWith('attribute_')) {
      let attrName = key.replace('attribute_', '').replace(/^pa_/, '');
      try {
        attrName = decodeURIComponent(attrName);
      } catch (e) { /* keep as-is */ }
      attrs[attrName] = value;
    }
  }
  
  variations.push({
    id,
    parent_id: parentId,
    parent_slug: parentSlug,
    attributes: attrs,
    price: meta.get('_price') || null,
    regular_price: meta.get('_regular_price') || null,
    sale_price: meta.get('_sale_price') || null,
    sku: meta.get('_sku') || null,
    stock_status: meta.get('_stock_status') || null,
    stock_quantity: meta.get('_stock') ? parseInt(meta.get('_stock')) : null,
    description: row[6] || '',
  });
}

console.log(`  Extracted ${variations.length} variations`);

// ====== Extract categories ======
console.log('\nExtracting categories...');
const productCats = termsByTaxonomy.get('product_cat') || [];
const categories = [];
for (const tax of productCats) {
  const term = termsMap.get(tax.term_id);
  if (term) {
    categories.push({
      id: term.id,
      name: term.name,
      slug: term.slug,
      description: tax.description,
      count: tax.count,
      parent: tax.parent,
    });
  }
}
console.log(`  Extracted ${categories.length} categories`);

// ====== Extract posts (blog) ======
console.log('\nExtracting blog posts...');
const blogPosts = postsRows.filter(r => r[20] === 'post' && r[7] !== 'auto-draft' && r[7] !== 'trash');
console.log(`  Found ${blogPosts.length} posts (all statuses except auto-draft/trash)`);

const posts = [];
for (const row of blogPosts) {
  posts.push({
    id: parseInt(row[0]),
    slug: row[11] || '',
    title: row[5] || '',
    excerpt: row[6] || '',
    content_len: (row[4] || '').length,
    date: row[2] || '',
  });
}
console.log(`  Extracted ${posts.length} posts`);

// ====== Extract pages ======
console.log('\nExtracting key pages...');
const pagePosts = postsRows.filter(r => r[20] === 'page' && r[7] !== 'auto-draft' && r[7] !== 'trash');
console.log(`  Found ${pagePosts.length} pages total (all statuses except auto-draft/trash)`);

const targetSlugs = new Set(['home-modern-2', 'company-about', 'dostavka', 'contact-us', 'shop']);
const pages = [];
for (const row of pagePosts) {
  const slug = row[11] || '';
  if (targetSlugs.has(slug)) {
    pages.push({
      id: parseInt(row[0]),
      slug,
      title: row[5] || '',
      content_len: (row[4] || '').length,
    });
  }
}
console.log(`  Extracted ${pages.length} target pages`);

// Also find all pages with their slugs
const allPages = pagePosts.map(r => ({
  id: parseInt(r[0]),
  slug: r[11] || '',
  title: r[5] || '',
}));

// ====== Write output ======
console.log('\n--- Writing output files ---');

const write = (name, data) => {
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ${name}: ${JSON.stringify(data).length} bytes`);
};

write('products.json', products);
write('variations.json', variations);
write('categories.json', categories);
write('posts.json', posts);
write('pages.json', pages);

// ====== Report ======
console.log('\n===== REPORT =====');
console.log(`Products: ${products.length}`);
console.log(`Variations: ${variations.length}`);
console.log(`Categories: ${categories.length}`);
console.log(`Blog posts: ${posts.length}`);
console.log(`Target pages: ${pages.length}`);

console.log('\n--- Categories ---');
for (const c of categories) {
  console.log(`  [${c.id}] ${c.name} (${c.slug}) — count: ${c.count}`);
}

console.log('\n--- All page slugs ---');
for (const p of allPages) {
  console.log(`  [${p.id}] "${p.title}" → "${p.slug}"`);
}

// ====== Photo distribution report ======
console.log('\n--- Photo distribution ---');
const photoCounts = {};
let productsWithoutPhotos = [];
for (const p of products) {
  const c = p.gallery.length;
  photoCounts[c] = (photoCounts[c] || 0) + 1;
  if (c === 0) {
    productsWithoutPhotos.push({ id: p.id, slug: p.slug, title: p.title });
  }
}
for (let i = 0; i <= 5; i++) {
  if (photoCounts[i]) {
    console.log(`  ${i} photos: ${photoCounts[i]} products`);
  }
}
if (photoCounts['5+'] || Object.keys(photoCounts).some(k => k >= 5)) {
  const plus5 = Object.entries(photoCounts).filter(([k]) => k >= 5).reduce((s, [,v]) => s + v, 0);
  console.log(`  5+ photos: ${plus5} products`);
}

if (productsWithoutPhotos.length > 0) {
  console.log(`\n--- Products WITHOUT photos (${productsWithoutPhotos.length}) ---`);
  for (const p of productsWithoutPhotos) {
    console.log(`  [${p.id}] ${p.title} (${p.slug})`);
  }
} else {
  console.log('\nAll products have photos!');
}

console.log('\n--- Sample 3 products (with gallery) ---');
for (const p of products.slice(0, 3)) {
  console.log(JSON.stringify(p, null, 2));
}

console.log('\nDone!');