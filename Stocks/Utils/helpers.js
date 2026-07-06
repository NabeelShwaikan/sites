window.Masar = window.Masar || {};
Masar.Utils = Masar.Utils || {};

Masar.Utils.escapeCsv = function(value){
  return '"' + String(value).replaceAll('"','""') + '"';
};

Masar.Utils.downloadTextFile = function(filename, content, type='text/plain;charset=utf-8'){
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], {type}));
  link.download = filename;
  link.click();
};
