function base64ToFile(base64, filename, mimeType = 'image/jpeg') {
    const arr = base64.split(',');
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
  
    return new File([u8arr], filename, { type: mimeType });
  }
export default  base64ToFile;