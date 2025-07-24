const fs = require('fs');
const path = require('path');

const VIEWS_DIR = path.join(__dirname, '../src/views');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (file.endsWith('.vue')) {
      callback(fullPath);
    }
  });
}

function batchReplace(file) {
  let content = fs.readFileSync(file, 'utf8');
  let replaced = content
    // slot="prepend"/slot="append" -> v-slot:prepend/v-slot:append
    .replace(/slot="prepend"/g, 'v-slot:prepend')
    .replace(/slot="append"/g, 'v-slot:append')
    // .native 修饰符移除
    .replace(/([@:]\w+)\.native/g, '$1')
    // slot-scope -> #default
    .replace(/slot-scope="([a-zA-Z0-9_]+)"/g, '#default="$1"')
    // :visible.sync -> :model-value
    .replace(/:visible\.sync=/g, ':model-value=')
    // @keyup.enter.native -> @keyup.enter
    .replace(/@keyup\.enter\.native/g, '@keyup.enter');
  if (replaced !== content) {
    fs.writeFileSync(file, replaced, 'utf8');
    console.log('Replaced:', file);
  }
}

walk(VIEWS_DIR, batchReplace);
console.log('Element-plus 批量替换完成！');
