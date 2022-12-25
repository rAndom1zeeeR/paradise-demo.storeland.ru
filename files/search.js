///////////////////////////////////////////////////////
/* Поиск */
//////////////////////////////////////////////////////
// Форма поиска ( Сразу же помечаем объект поиска, как инициализированный, чтобы случайно не инициализировать его дважды.)
function SearchFieldInit(obj) {
	// Блок в котором лежит поле поиска
	obj.f_search = obj.find('.search__form');
	// Если поля поиска не нашлось, завершаем работу, ничего страшного.
	if(0 == obj.f_search.length) {
		return false;
	}
	// Поле поиска товара
	obj.s_search = obj.f_search.find('.search__input');
	// Обнуление данных в форме поиска
	obj.s_reset  = obj.f_search.find('.search__reset');
	// Проверка на существование функции проверки поля и действий с ним
	if(typeof(obj.SearchFieldCheck) != 'function') {
		console.log('function SearchFieldCheck is not found in object for SearchFieldInit', {status: 'error'});
		return false;
		// Проверка, сколько полей поиска нам подсунули за раз на инициализацию
	} else if(1 < obj.f_search.length) {
		console.log('function SearchFieldInit must have only one search object', {status: 'error'});
		return false;
	}
	// Создаём функцию которая будет отвечать за основные действия с полем поиска
	obj.__SearchFieldCheck = function (isAfter) {
		// Если в поле текста есть вбитые данные
		if(obj.s_search.val().length) {
			obj.f_search.addClass('search__filled');
			obj.f_search.parent().addClass('search__filled');
		} else {
			obj.f_search.removeClass('search__filled');
			obj.f_search.parent().removeClass('search__filled');
		}
		// При нажатии клавиши данных внутри поля ещё нет, так что проверки вернут информацию что менять поле не нужно, хотя как только операция будет завершена данные в поле появятся. Поэтому произведём вторую проверку спустя 2 сотых секунды.
		if(typeof( isAfter ) == "undefined" || !isAfter) {
			setTimeout(function(){
				obj.__SearchFieldCheck(1)
			},20);
		}else{
			return obj.SearchFieldCheck();
		}
	}
	// Действия с инпут полем поиска
	obj.s_search.click(function(){
		obj.__SearchFieldCheck();
	}).focus(function(){
		obj.f_search.addClass('search__focused');
		obj.f_search.parent().addClass('search__focused');
		obj.__SearchFieldCheck();
	}).blur(function(){
		obj.f_search.removeClass('search__focused');
		obj.f_search.parent().removeClass('search__focused');
		obj.__SearchFieldCheck();
	}).keyup(function(I){
		switch(I.keyCode) {
				// игнорируем нажатия на эти клавишы
			case 13:  // enter
			case 27:  // escape
			case 38:  // стрелка вверх
			case 40:  // стрелка вниз
				break;
			default:
				obj.f_search.removeClass('search__focused');
				obj.__SearchFieldCheck();
				break;
		}
	}).bind('paste', function(e){
		obj.__SearchFieldCheck();
		setTimeout(function(){
			obj.__SearchFieldCheck()
		},20);
	}).bind('cut', function(e){
		$('#search-results').hide();
		$('.search-results__inner > div').remove();
		obj.__SearchFieldCheck();
	});

	//Считываем нажатие клавиш, уже после вывода подсказки
	var suggestCount;
	var suggestSelected = 0;
	function keyActivate(n){
		var $links = $('.search-results__item');
		$links.eq(suggestSelected-1).removeClass('is-actived');
		if(n == 1 && suggestSelected < suggestCount){
			suggestSelected++;
		}else if(n == -1 && suggestSelected > 0){
			suggestSelected--;
		}
		if( suggestSelected > 0){
			$links.eq(suggestSelected-1).addClass('is-actived');
		}
	}
	obj.s_search.keydown(function(I){
		switch(I.keyCode) {
				// По нажатию клавиш прячем подсказку
			case 27: // escape
				$('#search-results').hide();
				return false;
				break;
				// Нажатие enter при выделенном пункте из поиска
			case 13: // enter
				if(suggestSelected){
					var $link = $('.search-results__item').eq(suggestSelected - 1);
					var href = $link.attr('href');
					if(href){
						document.location = href
					} else {
						$link.trigger('click')
					}
					return false;
				}
				break;
				// делаем переход по подсказке стрелочками клавиатуры
			case 38: // стрелка вверх
			case 40: // стрелка вниз
				I.preventDefault();
				suggestCount = $('.search-results__item').length
				if(suggestCount){
					//делаем выделение пунктов в слое, переход по стрелочкам
					keyActivate(I.keyCode-39);
				}
				break;
			default:
				suggestSelected = 0;
				break;
		}
	});
	// Кнопка обнуления данных в форме поиска
	obj.s_reset.click(function(){
		obj.s_search.val('').focus();
		$('#search-results').hide();
		$('.search-results__item').remove();
	});
	// Проверка данных в форме после инициализации функционала. Возможно браузер вставил туда какой-либо текст, нужно обработать и такой вариант
	obj.__SearchFieldCheck();
}

// Аналог php функции.
function htmlspecialchars(text) {
	return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
}
function substr(str,start,len){str+='';var end=str.length;if(start<0){start+=end;}end=typeof len==='undefined'?end:(len<0?len+end:len+start);return start>=str.length||start<0||start>end?!1:str.slice(start,end);}
function md5(str){var xl;var rotateLeft=function(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));};var addUnsigned=function(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
	if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}};var _F=function(x,y,z){return(x&y)|((~x)&z);};var _G=function(x,y,z){return(x&z)|(y&(~z));};var _H=function(x,y,z){return(x^y^z);};var _I=function(x,y,z){return(y^(x|(~z)));};var _FF=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _GG=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _HH=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _II=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var convertToWordArray=function(str){var lWordCount;var lMessageLength=str.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=new Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(str.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
	lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};var wordToHex=function(lValue){var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;wordToHexValue_temp="0"+lByte.toString(16);wordToHexValue=wordToHexValue+wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);}
	return wordToHexValue;};var x=[],k,AA,BB,CC,DD,a,b,c,d,S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;str=this.utf8_encode(str);x=convertToWordArray(str);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;xl=x.length;for(k=0;k<xl;k+=16){AA=a;BB=b;CC=c;DD=d;a=_FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=_FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=_FF(c,d,a,b,x[k+2],S13,0x242070DB);b=_FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=_FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=_FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=_FF(c,d,a,b,x[k+6],S13,0xA8304613);b=_FF(b,c,d,a,x[k+7],S14,0xFD469501);a=_FF(a,b,c,d,x[k+8],S11,0x698098D8);d=_FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);a=_GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=_GG(d,a,b,c,x[k+6],S22,0xC040B340);c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=_GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=_GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=_GG(d,a,b,c,x[k+10],S22,0x2441453);c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=_GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=_GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=_GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=_GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=_GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=_GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=_HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=_HH(d,a,b,c,x[k+8],S32,0x8771F681);c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=_HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=_HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=_HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=_HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=_HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=_HH(b,c,d,a,x[k+6],S34,0x4881D05);a=_HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=_HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=_II(a,b,c,d,x[k+0],S41,0xF4292244);d=_II(d,a,b,c,x[k+7],S42,0x432AFF97);c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=_II(b,c,d,a,x[k+5],S44,0xFC93A039);a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);d=_II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=_II(b,c,d,a,x[k+1],S44,0x85845DD1);a=_II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=_II(c,d,a,b,x[k+6],S43,0xA3014314);b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=_II(a,b,c,d,x[k+4],S41,0xF7537E82);d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=_II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=_II(b,c,d,a,x[k+9],S44,0xEB86D391);a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD);}
	var temp=wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);return temp.toLowerCase();}
function utf8_encode(argString){var string=(argString+'');var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if(c1>127&&c1<2048){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
	if(enc!==null){if(end>start){utftext+=string.substring(start,end);}
		utftext+=enc;start=end=n+1;}}
	if(end>start){utftext+=string.substring(start,string.length);}
	return utftext;}
function rand(min,max){var argc=arguments.length;if(argc===0){min=0;max=2147483647;}else if(argc===1){throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');}return Math.floor(Math.random()*(max-min+1))+min;}
// Получить md5 хэш
function GenMd5Hash () {
	return substr(md5(parseInt(new Date().getTime() / 1000, 10)),rand(0,24),8);
}

// Живой поиск
$(function(){
	// Навигационная таблица над таблицей с данными
	var searchBlock = $('.search');
	var options = {
		target: 'form.store_ajax_catalog',
		url:  '/admin/store_catalog',
		items_target: '#goods',
		last_search_query:  '',
	};
	// По этому хэшу будем обращаться к объекту извне
	var randHash = GenMd5Hash();
	// Если объекта со списком ajax функций не существует, создаём её
	if(typeof(document.SearchInCatalogAjaxQuerySender) == 'undefined') {
		document.SearchInCatalogAjaxQuerySender = {};
	}
	// Поле поиска обновилось, внутри него можно выполнять любые действия
	searchBlock.SearchFieldCheck = function(){
		// Отменяем выполнение последнего запущенного через таймаут скрипта, если таковой был.
		if(typeof(document.lastTimeoutId) != 'undefined') {
			clearTimeout(document.lastTimeoutId);
		}
		document.lastTimeoutId = setTimeout("document.SearchInCatalogAjaxQuerySender['" + randHash + "']('" + htmlspecialchars(searchBlock.s_search.val()) + "');", 300);
	}
	// Отправляет запрос к серверу с задачей поиска товаров
	document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
		var last_search_query_array = [];
		// sessionStorage is available
		if (typeof sessionStorage !== 'undefined') {
			try {
				if(sessionStorage.getItem('lastSearchQueryArray')){
					last_search_query_array = JSON.parse(sessionStorage.getItem('lastSearchQueryArray'));
					// Находим соответствие текущего запроса с sessionStorage
					var currentSearch = $.grep(last_search_query_array, function (item){
						return item.search_query == old_val
					})[0]
					if(currentSearch){
						showDropdownSearch(JSON.parse(currentSearch.content));
						return;
					}
				}else{
					sessionStorage.setItem('lastSearchQueryArray', '[]')
				}
			}catch(e) {
				// sessionStorage is disabled
			}
		}
		// Если текущее значение не изменилось спустя 300 сотых секунды и это значение не то по которому мы искали товары при последнем запросе
		if(htmlspecialchars(searchBlock.s_search.val()) == old_val && searchBlock.s_search.val().length > 1) {
			// Запоминаем этот запрос, который мы ищем, чтобы не произвводить повторного поиска
			options['last_search_query'] = old_val;
			// Добавляем нашей форме поиска поле загрузки
			searchBlock.f_search.addClass('search__load');
			// Собираем параметры для Ajax запроса
			var params = {
						'ajax_q'                : 1,
						'goods_search_field_id' : 0,
						'q'                     : options['last_search_query'],
					},
					// Объект со значением которого будем в последствии проверять полученные от сервера данные
					search_field_obj = searchBlock.s_search;
			// Аяксом отправляем запрос на поиск нужных товаров и категорий
			$.ajax({
				type: "POST",
				cache: false,
				url: searchBlock.f_search.attr('action'),
				data: params,
				dataType: 'json',
				success: function(data) {
					// Если набранный запрос не соответствует полученным данным, видимо запрос пришёл не вовремя, отменяем его.
					if(search_field_obj.val() != old_val) {
						return false;
					}
					// Записываем в sessionStorage
					if (typeof sessionStorage !== 'undefined') {
						try {
							sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
							// Находим соответствие текущего запроса с sessionStorage
							var currentSearch = $.grep(last_search_query_array, function (item){
								return item.search_query == old_val
							})[0]
							//Если такого запроса ещё не было запишем его в sessionStorage
							if(typeof currentSearch == 'undefined'){
								// Добавляем в массив последних запросов данные по текущему запросу
								last_search_query_array.push({
									search_query: old_val,
									content: JSON.stringify(data)
								})
								sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
							}
						}catch(e){
							// sessionStorage is disabled
						}
					}
					// Показываем результаты на основе пришедших данных
					showDropdownSearch(data);
					// Убираем информацию о том что запрос грузится.
					searchBlock.f_search.removeClass("search__load");
				}
			});
		}else{
			$("#search-results").hide();
		}

		function showDropdownSearch(data){
			// Отображение категорий в поиске
			if(data.category.length!=undefined && data.category.length>0){
				$(".search-results__category .search-results__item").remove();
				$("#search-results").hide();
				for(с=0; с < data.category.length; с++){
					// Проверка наличия изображения
					if (data.category[с].image_icon == null) {
						data.category[с].image_icon = '/design/no-photo.png'
					} else {
						data.category[с].image_icon = data.category[с].image_icon;
					}
					// Отображаем результат поиска
					if(с <= 3){
						$(".search-results__category").append('<a class="search-results__item flex" href="'+ data.category[с].url +'" data-id="'+ data.category[с].goods_cat_id +'"><div class="search-results__image flex-center"><img src="'+ data.category[с].image_icon +'" /></div><div class="search-results__name"><span>'+ data.category[с].goods_cat_name +'</span></div></a>');
					}
				}
			}else{
				$(".search-results__category .search-results__item").remove();
				$("#search-results").hide();
			}
			// Отображение товаров в поиске
			if(data.goods.length!=undefined && data.goods.length>0){
				$(".search-results__goods .search-results__item").remove();
				$("#search-results").hide();
				for(i=0; i < data.goods.length; i++){
					// Проверка наличия изображения
					if (data.goods[i].image_icon == null) {
						data.goods[i].image_icon = '/design/no-photo.png'
					} else {
						data.goods[i].image_icon = data.goods[i].image_icon;
					}
					// Отображаем результат поиска
					if(i <= 3){
						$(".search-results__goods").append('<a class="search-results__item flex" href="'+ data.goods[i].url +'" data-id="'+ data.goods[i].goods_id +'"><div class="search-results__image flex-center"><img src="'+ data.goods[i].image_icon +'" /></div><div class="search-results__name"><span>'+ data.goods[i].goods_name +'</span></div></a>');
					}
					// Если последняя итерация цикла вставим кнопку "показать все"
					if(i > 3){
						$('.search-results__showAll').show();
					}
				}
			}else{
				$(".search-results__goods .search-results__item").remove();
				$("#search-results").hide();
			}
			// Скрываем результаты поиска если ничего не найдено
			if((data.category.length + data.goods.length) > 0){
				$("#search-results").show();
			}else{
				$("#search-results").hide();
			}

			if((data.category.length) > 0){
				$(".search-results__category").show();
			}else{
				$(".search-results__category").hide();
			}

			if((data.goods.length) > 0){
				$(".search-results__goods").show();
			}else{
				$(".search-results__goods").hide();
			}
			// Убираем информацию о том что запрос грузится.
			searchBlock.f_search.removeClass("search__load");
		}
	}

	SearchFieldInit(searchBlock);

	$('.search-results__showAll').on('click', function(){
		$('.search__form').submit();
	});

});