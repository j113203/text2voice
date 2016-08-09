var j1Lib_voice = function(text,version,lang,callback){

	version = version || "v1";
	
	var replace_word = {
		
	};
	
	var replace = function(w){
		return replace_word[w] || w;
	};
	text = text.split('');
	
	var sound = {};
	var getSound = function(w,lang_,callback){
		if (sound[version+"/"+w]){
			callback(sound[version+"/"+w]);
		}else{
			var ajax = j1Lib_ajax("js/j1Lib_voice/"+version+"/"+lang_+"/"+w+".mp3",function(data){
				sound[version+"/"+w] = (window.URL || window.webkitURL).createObjectURL(data.response);
				callback(sound[version+"/"+w]);
			},function(){
				if (lang=="en"){
					callback();
				}else{
					getSound(w,"en",callback);
				}
			});
			ajax.responseType = 'blob';
			ajax.send();
		}	
	};
	
	var audio = function(url){
		var au = new Audio(url);
		au.preload="auto";
		au.volume = 1;
		return au;
	};
	
	var audio_cache = [];
	var cache = function(i,callback){
		if (text[i]){
			getSound(replace(text[i]).toUpperCase(),lang,function(url){
				audio_cache.push(audio(url));
				cache(i+1,callback);
			});
		}else{
			callback();
		}
	};
	
	var play = function(){
		var au = audio_cache.shift();
		if (au){
			au.playbackRate="1.2";
			au.addEventListener("ended",function(event){
				this.removeEventListener("ended",arguments.callee);
				play();
			});
			au.play();
		}else{
			callback();
		}
	};
	cache(0,function(){
		play();
	});

};