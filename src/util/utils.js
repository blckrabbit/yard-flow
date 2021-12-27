/** 生成唯一标识 */
export function guid() {
    return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 26) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(26);
    });
}

export  function getGuid32L() {
	return 'xxxxxxxxxxxx4xxxyx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(10);
	}).substr(0, 18);
}