(function(w, d, s, q, i) {
    w[q] = w[q] || [];
    var f = d.getElementsByTagName(s)[0],j = d.createElement(s);
    j.async = true;
    j.id = 'beacon-aplus';
    j.src = 'https://d.alicdn.com/alilog/mlog/aplus/'+i+'.js';
    f.parentNode.insertBefore(j, f);
   })(window, document, 'script', 'aplus_queue', '203561150');
   aplus_queue.push({
	    action: 'aplus.setMetaInfo', 
        arguments: ['appKey','810ywjh64nz67ur4ne6m4ufi']
   });
   aplus_queue.push({
    action: 'aplus.setMetaInfo', 
    arguments: ['aplus-rhost-v','quickaplus-he-api-cn-shanghai.aliyuncs.com']
   });
   aplus_queue.push({
    action: 'aplus.setMetaInfo', 
    arguments: ['aplus-waiting','MAN']
   });
function QT(eventId,event,obj){
    console.log('调试信息===>>>>>>>','事件ID:==>',eventId)
    console.log('调试信息===>>>>>>>','事件类型:==>',event)
    console.log('调试信息===>>>>>>>','上报参数:==>',obj)
    aplus_queue.push({
        action: 'aplus.record', 
        arguments: [eventId, event, obj]
    })
}
