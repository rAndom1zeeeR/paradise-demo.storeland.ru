///////////////////////////////////////
/// Общие функции ///
///////////////////////////////////////

// Установка cookie файлов на основном домене магазина, в случае если покупатель зашёл на другой домен магазина, например по старой ссылке
try{$(document).ajaxSuccess(function(i,l,h){try{if(-1<h.data.indexOf("ajax_q=1")){var d=$.parseJSON(l.responseText);if(null!=d&&typeof(d.setcookie)=="object"){for(var g in d.setcookie){var c=document.createElement("script");c.type="text/javascript";c.async=typeof(d.status)=="undefined"||d.status=="reload"?true:false;c.src=d.setcookie[g];var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(c,f);}}}}catch(j){}});}catch(e){}
// Установка cookie файлов на основном домене магазина, в случае если покупатель зашёл на другой домен магазина, например по старой ссылке
try{$(document).ajaxSuccess(function(i,l,h){try{if(typeof(h.data)!="undefined"&&-1<h.data.indexOf("ajax_q=1")){var d=$.parseJSON(l.responseText);if(null!=d&&typeof(d.setcookie)=="object"){for(var g in d.setcookie){var c=document.createElement("script");c.type="text/javascript";c.async=typeof(d.status)=="undefined"||d.status=="reload"?true:false;c.src=d.setcookie[g];var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(c,f);}}}}catch(j){}});}catch(e){}

// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError(desc, page, line) {
  var img=document.createElement('img');
  img.src = 'https://storeland.ru/error/js?desc='+encodeURIComponent(desc)+'&page='+encodeURIComponent(window.location)+'&line=0';
  img.style.position = 'absolute';
  img.style.top = '-9999px';
  try { document.getElementsByTagName('head').appendChild(img) } catch (e){}
  return false;
}

// Проверка вводимых значений в количестве товара
function keyPress(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0 || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}

// Функция определения ширины экрана пользователя
function getClientWidth() {
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}

// Функция определения браузера
function userAgent(){
  var ua = detect.parse(navigator.userAgent);
  $('body').addClass(ua.browser.family);
}

// Добавляет пробел 1000 -> 1 000  /  10000 -> 10 000
function addSpaces(nStr){
	return String(nStr).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
}

// Предзагрузчик
function preload() {
  var preloader = $('.preloader');
  var spinner = preloader.find('.preloading');
  spinner.fadeOut();
  preloader.delay(1000).fadeOut('slow');
}

// Функция Наверх
function toTop() {
	var toTop = $('.toTop');
	// Показать при скроле
  $(window).on('scroll', function(){
		$(this).scrollTop() > 100 ? toTop.fadeIn() : toTop.fadeOut();
  });

	// Действие наверх
  toTop.on('click', function(){
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  });
}



///////////////////////////////////////
// Уведомления
///////////////////////////////////////
function notyStart($content, $type) {
  new Noty({
    text: $content,
    layout: 'bottomCenter',
    type: $type,
    theme: '',
    textAlign: 'center',
    animation: {
      open: 'animated fadeInUp',
      close: 'animated fadeOutDown',
      easing: 'swing',
      speed: 400
    },
    timeout: "2000",
    progressBar: false,
    closable: true,
    closeOnSelfClick: true,
		closeWith: ['click', 'button'],
    modal: false,
    dismissQueue: false,
    killer: false
  }).show();
}


///////////////////////////////////////
// Изменение текста в объкте
///////////////////////////////////////
function changeTxt(txtObject) {
	var
		// Ссылка по которой кликнули
		LObject = $(txtObject),
		// Старый текст ссылки
		txtOld = LObject.text(),
		// Новый текст ссылки
		txtNew = LObject.attr('data-txt');
	// Если объекты не получены, завершим работу функции
	if(LObject.length==0 ) {
		return false;
	}
	// Изменяем у ссылки текст со старого на новый
	LObject.html(txtNew);
	// Старый текст ссылки сохраняем в атрибуте data-txt
	LObject.attr('data-txt', txtOld);
}


///////////////////////////////////////
/*** Кол-во ***/
///////////////////////////////////////
class Quantity {
	// Функция Плюс + для товара. //JS
	plus(obj) {
		obj.value = parseInt(obj.value) + 1
		obj.setAttribute('value', obj.value)
		obj.dispatchEvent(new Event('input'));
		return false
	};

	// Функция Минус - для товара. //JS
	minus(obj) {
		obj.value = parseInt(obj.value) - 1
		obj.setAttribute('value', obj.value)
		obj.dispatchEvent(new Event('input'));
		return false
	};

	// Проверка кол-ва. //JS
	check(obj) {
		// Количество
		let val = parseInt(obj.value);
		// Проверка максимальныго остатка
		const max = parseInt(obj.getAttribute('max'));

		// Если вводят 0 то заменяем на 1
		if (!val || val < 1) {
			obj.value = 1;
			val = 1;
			obj.previousElementSibling.classList.add('qty__disable');
			return false;
		} else {
			obj.previousElementSibling.classList.remove('qty__disable');
		}

		// Если товара нет в наличии
		if (max == 0) {
			obj.value = 1;
			obj.previousElementSibling.classList.add('qty__disable');
			obj.nextElementSibling.classList.add('qty__disable');
			// Сообщение пользователю
			const message = quantity.notyMessage('Внимание! Вы пытаетесь положить в корзину товар которого нет в наличии');
			notyStart(message, 'warning');
			return false;
		}

		// Если добавляют больше
		if (val > max) {
			obj.value = max;
			val = max;
			obj.nextElementSibling.classList.add('qty__disable');
			// Сообщение пользователю
			const message = quantity.notyMessage('Внимание! Вы пытаетесь положить в корзину товара больше, чем есть в наличии');
			notyStart(message, 'warning');
			return false;
		} else {
			obj.nextElementSibling.classList.remove('qty__disable');
		}		
	};

	// Сообщение пользователю
	notyMessage(message) {
		return `<div class="noty__addto"><div class="noty__message">${message}</div></div>`;
	};

}

// Кол-во в карточке
class QuantityGoods extends Quantity {
	// Статус запуска функции
	once = false;

	constructor () {
		super()
	};

	// Действия в карточке товара
	onGoods() {
		const qty = document.querySelector('.productView__qty')
		const qtyMinus = qty.querySelector('.qty__select_minus')
		const qtyPlus = qty.querySelector('.qty__select_plus')
		const qtyInput = qty.querySelector('.qty__input')

		// Если не карточка товара
		if (qty == null) return false;

		// Если функция уже запущена
		if (this.once) return false;

		// Минус
		qtyMinus.addEventListener('click', () => quantityGoods.minus(qtyInput))

		// Плюс
		qtyPlus.addEventListener('click', () => quantityGoods.plus(qtyInput))

		// Изменение
		qtyInput.addEventListener('input', function () {
			quantityGoods.check(qtyInput)
			quantityGoods.updGoods(qtyInput)
		})

		// Статус запуска функции
		this.once = true

	};

	// Изменение кол-ва в карточке. //JS
	updGoods(obj) {
		const block = obj.closest('.productViewBlock');
		// Если не карточка товара
		if (block == null) return false;

		// Объявляем переменные цены
		const val = block.querySelector('.qty__input').value;
		block.querySelector('.goodsDataMainModificationId').value = val;

		// Обновление цены
		const blockNow = block.querySelector('.price__now');
		const priceNow = blockNow.getAttribute('data-price');
		const multiNow = parseInt(val * priceNow);
		blockNow.querySelector('.num').innerHTML = addSpaces(multiNow);

		// Обновление старой цены
		const blockOld = block.querySelector('.price__old');
		if (blockOld) {
			const priceOld = blockOld.getAttribute('data-price');
			const multiOld = parseInt(val * priceOld);
			blockOld.querySelector('.num').innerHTML = addSpaces(multiOld);
		}
	};

}

// Кол-во в выпадающей корзине
class QuantityAddto extends Quantity {
	constructor () {
		super()
	}

	// Действия в выпадающей корзине
	onAddto() {
		const elements = document.querySelectorAll('.addto__qty');
		// Если нет элементов
		if (elements == null) return false;

		elements.forEach((el) => {
			const qtyMinus = el.querySelector('.qty__select_minus')
			const qtyPlus = el.querySelector('.qty__select_plus')
			const qtyInput = el.querySelector('.qty__input')

			// Минус
			qtyMinus.addEventListener('click', () => quantityAddto.minus(qtyInput))

			// Плюс
			qtyPlus.addEventListener('click', () => quantityAddto.plus(qtyInput))

			// Изменение
			qtyInput.addEventListener('input', function () {
				quantityAddto.check(this);
				quantityAddto.updAddto(this);
				quantityAddto.updAddtoProduct(this);
			})

		})
	};

	// Выпадающая корзина
	updAddto(obj) {
		const item = obj.closest('.addto__item');
		const mod = item.getAttribute('data-mod-id');
		const priceNow = item.querySelector('.price__now');
		const form = item.closest('.addto__form');
		const data = new FormData(form);
		data.append('only_body', '1');

		// Обновить корзину
		setTimeout(() => {
			quantityAddto.getAddtoCart(data, mod, priceNow);				
		}, 100);

	};

	// Обновление выпадающей корзины
	async getAddtoCart($data, $mod, $priceNow) {
		await fetch('/cart', {
			method: "POST",
			body: $data
		})
		// Получаем ответ
		.then((response) => response.text())
		// Преобразуем в html
		.then((html) => {
			// Convert the HTML string into a document object
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			quantityAddto.updAddtoContent(doc, $mod, $priceNow)

		})
		.catch((error) => console.error(error));
	};

	// Обновление выпадающей корзины
	updAddtoContent($doc, $mod, $priceNow) {
		// Обновить цену
		const price = $doc.querySelector('.cartTable__item[data-mod-id="' + $mod + '"] .cartTable__price');
		$priceNow.innerHTML = price.innerHTML;
		// Обновить кол-во
		const newCount = $doc.querySelector('.cart-count').innerHTML;
		quantityAddto.updAddtoCount(newCount);
		// Обновить сумму
		const newSum = $doc.querySelector('.cartSumTotal').innerHTML;
		quantityAddto.updAddtoSum(newSum);
		// Обновить скидку
		const newDiscount = $doc.querySelector('.cartTotal__item-discount .cartTotal__price');
		const totalDiscount = document.querySelector('.addto__total-discount')
		if (newDiscount){
			totalDiscount.classList.remove('is-hidden')
			quantityAddto.updAddtoDiscount(newDiscount.innerHTML)
		} else {
			totalDiscount.classList.add('is-hidden')
		}

	};

	// Обновление счетчика кол-ва корзины
	updAddtoCount($count) {
		const elements = document.querySelectorAll('.cart-count');
		elements.forEach((el) => {
			el.innerHTML = $count;
			el.setAttribute('data-cart-count', $count);
		});
	};

	// Обновление итоговой цены
	updAddtoSum($sum) {
		const elements = document.querySelectorAll('.cartSumNowDiscount');
		elements.forEach((el) => el.innerHTML = $sum)
	};

	// Обновление итоговой скидки
	updAddtoDiscount($sum) {
		const element = document.querySelector('.addto__total-discount .addto__total-price');
		element.innerHTML = $sum;
	};
	
	// Отображаем скидку 
	updAddtoSale() {
		const value = document.querySelector('.discountValue')
		// Если корзина пуста
		if (!value) return false
		// Если есть скидки
		const discount = value.closest('.addto__total-discount')
		value ? discount.classList.remove('is-hidden') : discount.classList.add('is-hidden')
	};

	// Обновить кол-во товаров
	updAddtoProduct(obj) {
		const val = obj.value
		const id = obj.closest('[data-id]').getAttribute('data-id')
		const mod = obj.getAttribute('name')
		const items = document.querySelectorAll('.product__item[data-id="'+ id +'"] .qty__input[name="'+ mod +'"]')
		
		if (!items) {return false}
		items.forEach((el) => el.value = val)
	}

}

// Кол-во в корзине
class QuantityCart extends Quantity {
	constructor () {
		super()
	}

	// Действия в выпадающей корзине
	onCart() {
		const elements = document.querySelectorAll('.cartTable__qty');
		// Если не карточка товара
		if (elements == null) return false;

		elements.forEach((el) => {
			const qtyMinus = el.querySelector('.qty__select_minus')
			const qtyPlus = el.querySelector('.qty__select_plus')
			const qtyInput = el.querySelector('.qty__input')

			// Минус
			qtyMinus.addEventListener('click', () => quantityCart.minus(qtyInput))

			// Плюс
			qtyPlus.addEventListener('click', () => quantityCart.plus(qtyInput))

			// Изменение
			qtyInput.addEventListener('input', function () {
				quantityCart.check(this);
				quantityCart.updCart(this);
			})

		})
	}

	// Корзина
	updCart(obj) {
		const item = obj.closest('.cartTable__item');
		const mod = item.getAttribute('data-mod-id');
		const priceNow = item.querySelector('.cartTable__price');
		const form = item.closest('.cartTable__form');
		const data = new FormData(form);
		data.append('only_body', '1');

		// Обновить корзину
		setTimeout(() => {
			quantityCart.getCart(data, mod, priceNow);
		}, 100);

	};

	// Обновление в корзине
	async getCart($data, $mod, $priceNow) {
		await fetch('/cart', {
			method: "POST",
			body: $data
		})
		// Получаем ответ
		.then((response) => response.text())
		// Преобразуем в html
		.then((html) => {
			// Convert the HTML string into a document object
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			quantityCart.updCartContent(doc, $mod, $priceNow)
		})
		.catch((error) => console.error(error));

	};

	// Обновление в корзине
	updCartContent($doc, $mod, $priceNow) {
		// Обновить цену
		const price = $doc.querySelector('.cartTable__item[data-mod-id="' + $mod + '"] .cartTable__price');
		$priceNow.innerHTML = price.innerHTML;
		// Обновить кол-во
		const newCount = $doc.querySelector('.cart-count').innerHTML;
		quantityAddto.updAddtoCount(newCount);
		// Обновить итого
		const newTotal = $doc.querySelector('.cartTotal__items').innerHTML;
		document.querySelector('.cartTotal__items').innerHTML = newTotal;
		// Обновить минимальную сумму заказа
		cart.minSum();
	};

}

// Кол-во продуктов
class QuantityProduct extends Quantity {
	constructor () {
		super()
	}

	// Действия в выпадающей корзине
	onProduct() {
		const elements = document.querySelectorAll('.product__qty');
		// Если нет элемента
		if (elements == null) return false;

		elements.forEach((el) => {
			const qtyMinus = el.querySelector('.qty__select_minus')
			const qtyPlus = el.querySelector('.qty__select_plus')
			const qtyInput = el.querySelector('.qty__input')

			// Минус
			qtyMinus.addEventListener('click', function () {
				quantityProduct.minus(qtyInput)
			})

			// Плюс
			qtyPlus.addEventListener('click', function () {
				quantityProduct.plus(qtyInput)
			})

			// Изменение
			qtyInput.addEventListener('input', function () {
				quantityProduct.check(this)
				quantityProduct.updAddtoValue(this)
			})

		})
	};
	
	// Обновить кол-во выпадающей корзины
	updAddtoValue(obj) {
		const val = obj.value
		const id = obj.closest('[data-id]').getAttribute('data-id')
		const mod = obj.getAttribute('name')
		const item = document.querySelector('.addto__item[data-id="'+ id +'"] .qty__input[name="'+ mod +'"]')
		
		if (!item) {return false}
		item.value = val
		item.dispatchEvent(new Event('input'));
	}

	// Обновить кол-во всех товаров
	updProdValue(obj) {
		const val = obj.value
		const id = obj.closest('[data-id]').getAttribute('data-id')
		const mod = obj.getAttribute('name')
		const items = document.querySelectorAll('.product__item[data-id="'+ id +'"] .qty__input[name="'+ mod +'"]')

		if (!items) {return false}
		items.forEach((el) => el.value = val)
	}
	
}


///////////////////////////////////////
// Конструктор функции пароля
///////////////////////////////////////
function Password() {

	this.onPass = function(){
		var content = document.querySelector('.form__showPass')
		// Если нет контента
		if(!content) {return false}
		
		content.addEventListener('click', function(event){
			password.showPass($(content));
		});
	}

	// Регистрация
	this.onReg = function(){
		var content = document.getElementById('registration')
		// Если нет контента
		if(!content){ return false}
		
		content.addEventListener('click', function(event){
			password.registration($(content));
		});
	}
	
	// Показать пароль
	// Превращает поле пароля в текстовое поле и обратно
  this.showPass = function($obj){
		$obj.toggleClass('is-actived')
		// Объект у которого изменяем тип с password на text
		var inputObject = $obj.parent().find('#sites_client_pass');
		// Изменяем тип input поля
		if(inputObject[0].type == 'text') {
			inputObject[0].type = 'password';
		} else {
			inputObject[0].type = 'text';
		}
  }
	
	// Текущее состояние CapsLock
	var capsLockEnabled=null;function getChar(a){if(a.which==null){if(a.keyCode<32){return null}return String.fromCharCode(a.keyCode)}if(a.which!=0&&a.charCode!=0){if(a.which<32){return null}return String.fromCharCode(a.which)}return null}if(navigator.platform.substr(0,3)!="Mac"){document.onkeydown=function(a){a=a||event;if(a.keyCode==20&&capsLockEnabled!==null){capsLockEnabled=!capsLockEnabled}}}document.onkeypress=function(b){b=b||event;var a=getChar(b);if(!a){return}if(a.toLowerCase()==a.toUpperCase()){return}capsLockEnabled=(a.toLowerCase()==a&&b.shiftKey)||(a.toUpperCase()==a&&!b.shiftKey)};
	this.checkCapsWarning = function(){document.getElementById("capslock").style.display=capsLockEnabled?"block":"none"}
	this.removeCapsWarning = function(){document.getElementById("capslock").style.display="none"};

	// Определения capslock в поле пароля
	this.capsWarning = function(){
		$('#sites_client_pass').on('keyup focus', function(event){
			password.checkCapsWarning(event)
		}).on('blue', function(){
			password.removeCapsWarning()
		});
	}

	// Регистрация
	this.registration = function($obj){
		if($obj.prop('checked')) {
			$obj.attr('checked', true);
			$('.form__pass').slideDown();
			$('#sites_client_email').attr('required', true).addClass('required').prev().addClass('required');
		} else {
			$obj.attr('checked', false);
			$('.form__pass').slideUp();
			$('#sites_client_email').attr('required', false).removeClass('required').prev().removeClass('required');
		}
	}

}


///////////////////////////////////////
// Конструктор функции Сравнения товаров
///////////////////////////////////////
function Compare() {

	// Слайдер сравнения
	this.onSlider = function(){
		var swiper = new Swiper('.compare__line',{
			loop: false,
			autoplay: false,
			watchSlidesVisibility: true,
			slidesPerView: 4,
			spaceBetween: 16,
			allowTouchMove: false,
			simulateTouch: false,
			grabCursor: false,
			autoHeight: true,
			lazy: {
				enabled: false,
				loadPrevNext: true,
				loadOnTransitionStart: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			breakpoints: {
				0: {
					slidesPerView: '1',
				},
				320: {
					slidesPerView: '2',
				},
				480: {
					slidesPerView: '2',
				},
				640: {
					slidesPerView: '3',
				},
				768: {
					slidesPerView: '3',
				},
				1024: {
					slidesPerView: '4',
				},
				1200: {
					slidesPerView: '4',
				}
			},
		});
	}

	this.onClick = function(){
		var content = document.querySelector('.compare__table')
		// Если нет контента
		if(!content){
			return false
		}
		
		content.addEventListener('click', function(event){
			// Объявление переменных
			var copmareSwitch = event.target.closest('.compare__switch');
			var copmareSelected = event.target.closest('.compare__selected');
			var copmareShowAll = event.target.closest('.compare__showAll')
			var copmareLine = $('.compare__line')
			var copmareShow = $('.compare__showAll')

			// Сравнение товаров. Отображение всех и различающихся характеристик товара
			if (copmareSwitch){
				// Обновляем текст
				changeTxt(event.target.nextElementSibling)
				// Показать отличия
				if ($(event.target.parentElement).hasClass('switch-on')) {
					$(event.target.parentElement).removeClass('switch-on');
					copmareLine.filter(':hidden').show();
					copmareShow.addClass('is-hide');
				} else {
					$(event.target.parentElement).addClass('switch-on');
					copmareLine.not('.is-same').show();
					copmareLine.filter('.is-same').hide();
					copmareShow.removeClass('is-hide');
				}

			}
			// Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
			else if (copmareSelected){
				copmareShow.removeClass('is-hide');
				// Скрываем выбранное
				copmareLine.each(function(){
					var сhecked = $(this).find('.compare__title input').filter(':checked');
					if(сhecked.length > 0) {
						$(this).hide();
					}
				});

			} 
			// Сравнение товаров. Отображение скрытых характеристик товара
			else if (copmareShowAll){
				$('.compare__switch').removeClass('switch-on');
				$(copmareShowAll).addClass('is-hide');
				copmareLine.filter(':hidden').show();
			}
			// Выход из функции
			else {
				return false
			}

			return true

		})

	}

}


///////////////////////////////////////
// Конструктор функции Товара
///////////////////////////////////////
function Product() {

	this.default = function(){
		$('.product__item').each(function(){
			product.hoverImage($(this))
			product.priceDiff($(this),'percent')
			product.checkRest(this)
		})
		product.changeMod()
	}

	// Проверка остатка. /JS/
	this.checkRest = function(obj){
		const qty = obj.querySelector('.qty__input')

		// Если у нет кол-ва
		if (!qty) { return false }

		// Если кол-во больше 0
		qty.getAttribute('max') > 1 ? obj.classList.remove('product__empty') : obj.classList.add('product__empty');
	}

	// Запуск функции активного класса товара в других категориях. /JS/
	this.inCartAll = function (id, mod){
		const items = document.querySelectorAll('.product__item[data-id="' + id + '"]')
		items.forEach((e) => {
			const qty = e.querySelector('.qty__input')
			const count = e.querySelector('.inCart__count')
			const addtoItem = document.querySelector('.addto__item[data-id="'+ id +'"] .qty__input[name="'+ mod +'"]')
			// Обновление данных
			e.classList.add('product__inCart');
			qty.value = addtoItem.value
			count.textContent = addtoItem.value
		})
	}

	// Разница в цене в процентах %
	this.priceDiff = function($obj,$type){
		// если есть старая цена
		if($obj.find('.price__old').length){
			var old = parseFloat($obj.find('.price__old .num').text().replace(' ',''));
			var now = parseFloat($obj.find('.price__now .num').text().replace(' ',''));
			var diff = 0;
			if ($type == 'percent') {
				var diffPercent = (((old - now)/old)*100).toFixed();
				$obj.find('.sticker__sales span').text('-' + diffPercent + '%');
			} else {
				diff = (old - now).toFixed();
				$obj.find('.sticker__sales .num').text(addSpaces(diff));
			}
		}else{
			$obj.find('.sticker__sales').hide();
		}
	
	}

	// Смена изображений при наведении
	this.hoverImage = function($obj) {
		var imagesLen = $obj.find('.product__imgID').length
		// если больше 2 изображений товара
		if (imagesLen > 2){
			// Создаем элементы при наведении на которые будут меняться изображения
			$obj.find('.product__imgID').each(function(){
				var image = $(this).attr('data-image')
				var id =  $(this).attr('data-id')
				// Создаем элементы
				$obj.find('.product__image-hover').append('<div class="product__hoverImage" data-image="'+ image +'" data-id="'+ id +'"></div>');
				// Добавляем активный класс на элемент навигации
				if (id == $obj.find('.product__img').data('id')){
					$obj.find('.product__hoverImage').removeClass('is-actived')
					$obj.find('.product__hoverImage[data-id="' + id + '"]').addClass('is-actived')
				}
			});

			// Ховер эффект изменения изображения
			$obj.find('.product__hoverImage').hover($.debounce(50, function(){
				var image = $(this).attr('data-image')
				var id =  $(this).attr('data-id')
				$obj.find('.product__img').attr({
					'image': image,
					'data-id': id
				});

				$obj.find('.product__img img').attr('src', image)
				$obj.find('.product__hoverImage').removeClass('is-actived')
				$(this).addClass('is-actived')

			}));

		} else {
			return false
		}

	}

	// Добавление в Сравнение и Избранное
	this.addTo = function () {
		// Определяем заголовок уведомления
		function checkMessage(str){
			if (str.indexOf('добавлен') != -1) {
				return 'Успешно добавлен!';
			} else {
				return 'Успешно удалён!';
			}
		}

		// Создать сообщение действия
		function createNoty(title, message, status, link, link_name) {
			return `
				<div class="noty__addto ${status} flex">
					<div class="noty__content">
						<div class="noty__title">${title}</div>
						<div class="noty__message">${message}</div>
					</div>
					<div class="noty__buttons">
						<a class="button-primary" href="${link}" title="${link_name}"><span>${link_name}</span></a>
					</div>
				</div>
			`;
		}

		// Рендер товара в списке
		function createItem(pDataid, pUrl, pName, pImg, pDataChar, pDataPrice, delUrl) {
			return `
				<div class="addto__item flex" data-id="${pDataid}">
					<a class="addto__image flex-center" href="${pUrl}" title="${pName}"><img src="${pImg}" /></a>
					<div class="addto__content">
						<a class="addto__name" href="${pUrl}" title="${pName}"><span>${pName}</span></a>
						<div class="addto__price ${pDataChar}">
							<div class="price__now"><span title="${pDataPrice} российских рублей"><span class="num">${pDataPrice}</span><span>р.</span></span></div>
						</div>
						<div class="addto__actions">
							<a class="addto__remove button-rotate button-link" href="${delUrl}?id=${pDataid}" data-id="${pDataid}" title="Убрать товар из списка"><i class="icon-close"></i></a>
						</div>
					</div>
				</div>
			`;
		}

		// Функция обновления ссылки
		function updateLink(a,from,to,newIsAddStatus,newTitle){
			// Обновляем ссылку, на которую будет уходить запрос и информацию о ней
			a.attr('href', a.attr('href').replace(new RegExp(from), to))
				.attr('title', newTitle)
				.attr('data-action-is-add', newIsAddStatus)
		}

		// Добавление/удаление товара Сравнение
		var blockCompare = '.compare'
		var addCompare = '.add-compare'
		var addtoComapre = '.addto__compare'

		$(addCompare).off('click').on('click', function () {
			// Объект ссылки, по которой кликнули
			var 
				a = $(this),
				isAdd = a.attr('data-action-is-add'),
				addUrl = a.attr('data-action-add-url'),
				delUrl = a.attr('data-action-delete-url'),
				addTitle = a.attr('data-action-add-title'),
				delTitle = a.attr('data-action-delete-title'),
				aText = a.find('span'),
				pName = a.attr('data-prodname'),
				pUrl = a.attr('data-produrl'),
				pImg = a.attr('data-prodimg'),
				pDataid = a.attr('data-id'),
				pDataPrice = a.attr('data-mod-price'),
				pDataChar = a.attr('data-char-code'),
				// addTooltip = a.attr('data-add-tooltip'),
				// delTooltip = a.attr('data-del-tooltip'),
				// pDataMod = a.attr('data-mod-id'),
				// actionUrl = a.attr('data-action-url'),
				requestUrl = a.attr('href');
			
			var flag = 0;

			// Проверка элемента в объекте
			$(addtoComapre).find('.addto__item').each(function () {
				if ($(this).attr('data-id') == pDataid) {
					flag = 1
				}
				
				if (flag == 1) {
					$(this).remove()
					return false
				}

				return flag
			})

			// Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
			if (addUrl && delUrl) {
				$.ajax({
					url: requestUrl,
					type: 'POST',
					dataType: 'json',
					cache: false,
					data: {
						'ajax_q': 1
					},
					success: function (data) {							
						if ('ok' == data.status) {
							// Рендер элементов в список
							if (flag == 0) {
								if ($(addtoComapre).length) {
									$(addtoComapre).find('.addto__items').prepend(createItem(pDataid, pUrl, pName, pImg, pDataChar, pDataPrice, delUrl));
								}
							}

							// Если указано, что изменилось число товаров на сравнении
							var countCompare = data.compare_goods_count;
							if (typeof (countCompare) != 'undefined') {
								// Блок информации о том, что есть товары на сравнении
								var sidecount = $(blockCompare).find('[data-count]')
								// Указываем информацию о новом количестве товаров на сравнении
								sidecount.text(countCompare).attr('data-count', countCompare)
								if (countCompare > 0) {
									$(blockCompare).addClass('has-items')
								} else {
									$(blockCompare).removeClass('has-items')
									sidecount.attr('data-count', '0').text('0')
									$(addCompare).removeAttr('title').removeClass('added')
								}
							}
							
							// Проверка статуса добавления товара
							if (isAdd == 1) {
								// Обновляем ссылку, на которую будет уходить запрос и информацию о ней
								updateLink(a,addUrl,delUrl,0,delTitle ? delTitle : '')
								a.addClass('added').parent().addClass('added')
								
								// Обновляем ссылку у всех товаров на странице
								$(addCompare).each(function(){
									if ($(this).attr('data-id') == pDataid) {
										$(this).addClass('added')
										updateLink($(this),addUrl,delUrl,0,delTitle ? delTitle : '')
									}
								})

							} else {
								// Обновляем ссылку, на которую будет уходить запрос и информацию о ней
								updateLink(a,delUrl,addUrl,1,addTitle ? addTitle : '')
								a.removeClass('added').parent().removeClass('added')
								
								// Обновляем ссылку у всех товаров на странице
								$(addCompare).each(function(){
									if ($(this).attr('data-id') == pDataid) {
										$(this).removeClass('added')
										updateLink($(this),delUrl,addUrl,1,addTitle ? addTitle : '')
									}
								})

							}

							// Обновление текстовой надписи с описанием действия
							if (aText.length) {
								aText.text(a.attr(isAdd == 1 ? 'data-del-tooltip' : 'data-add-tooltip'))
							}

							// Сообщение уведомления
							var content = createNoty(checkMessage(data.message), data.message, 'noty_good', '/compare', 'Перейти в Сравнение');
							
							// Если есть функция, которая отображает сообщения пользователю
							if (typeof (Noty) == 'function') {
								notyStart(content, 'success')
							}
						} else if ('error' == data.status) {
							// Сообщение уведомления
							var content = createNoty('Не удалось добавить!', data.message, 'noty_bad', '/compare', 'Перейти в Сравнение');
							
							// Если есть функция, которая отображает сообщения пользователю
							if (typeof (Noty) == 'function') {
								notyStart(content, 'warning')
							}
						}
					},
					error: function () {
						notyStart('Error Ajax add-compare', 'warning')
					}
				});

				return false;
			}
		});

		// Добавление/удаление товара Избранное
		var blockFavorites = '.favorites'
		var addFavorites = '.add-favorites'
		var addtoFavorites = '.addto__favorites'

		$(addFavorites).off('click').on('click', function () {
			// Объект ссылки, по которой кликнули
			var 
				a = $(this),
				isAdd = a.attr('data-action-is-add'),
				addUrl = a.attr('data-action-add-url'),
				delUrl = a.attr('data-action-delete-url'),
				addTitle = a.attr('data-action-add-title'),
				delTitle = a.attr('data-action-delete-title'),
				aText = a.find('span'),
				pName = a.attr('data-prodname'),
				pUrl = a.attr('data-produrl'),
				pImg = a.attr('data-prodimg'),
				pDataid = a.attr('data-id'),
				pDataPrice = a.attr('data-mod-price'),
				pDataChar = a.attr('data-char-code'),
				// addTooltip = a.attr('data-add-tooltip'),
				// delTooltip = a.attr('data-del-tooltip'),
				// pDataMod = a.attr('data-mod-id'),
				// actionUrl = a.attr('data-action-url'),
				requestUrl = a.attr('href');
			
			var flag = 0;

			// Проверка элемента в объекте
			$(addtoFavorites).find('.addto__item').each(function () {
				if ($(this).attr('data-id') == pDataid) {
					flag = 1;
				}

				if (flag == 1) {
					$(this).remove();
					return false;
				}

				return flag;
			});

			// Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
			if (addUrl && delUrl) {
				$.ajax({
					url: requestUrl,
					type: 'POST',
					dataType: 'json',
					cache: false,
					data: {
						'ajax_q': 1
					},
					success: function (data) {							
						if ('ok' == data.status) {
							// Рендер элементов в список
							if (flag == 0) {
								if ($(addtoFavorites).length) {
									$(addtoFavorites).find('.addto__items').prepend(createItem(pDataid, pUrl, pName, pImg, pDataChar, pDataPrice, delUrl));
								}
							}

							// Если указано, что изменилось число товаров в избранном
							var countFavorites = data.favorites_goods_count;
							if (typeof (countFavorites) != 'undefined') {
								// Блок информации о том, что есть товары в избранном
								var sidecount = $(blockFavorites).find('[data-count]')
								// Указываем информацию о новом количестве товаров в избранном
								sidecount.text(countFavorites).attr('data-count', countFavorites)
								if (countFavorites > 0) {
									$(blockFavorites).addClass('has-items');
								} else {
									$(blockFavorites).removeClass('has-items');
									sidecount.attr('data-count', '0').text('0');
									$(addFavorites).removeAttr('title').removeClass('added');
								}
							}

							// Проверка статуса добавления товара
							if (isAdd == 1) {
								// Обновляем ссылку, на которую будет уходить запрос и информацию о ней
								updateLink(a, addUrl,delUrl,0,delTitle ? delTitle : '')
								a.addClass('added').parent().addClass('added')
								
								// Обновляем ссылку у всех товаров на странице
								$(addFavorites).each(function(){
									if ($(this).attr('data-id') == pDataid) {
										$(this).addClass('added')
										updateLink($(this),addUrl,delUrl,0,delTitle ? delTitle : '')
									}
								})
							} else {
								// Обновляем ссылку, на которую будет уходить запрос и информацию о ней
								updateLink(a, delUrl,addUrl,1,addTitle ? addTitle : '')
								a.removeClass('added').parent().removeClass('added')
								
								// Обновляем ссылку у всех товаров на странице
								$(addFavorites).each(function(){
									if ($(this).attr('data-id') == pDataid) {
										$(this).removeClass('added')
										updateLink($(this),delUrl,addUrl,1,addTitle ? addTitle : '')
									}
								})
							}

							// Обновление текстовой надписи с описанием действия
							if (aText.length) {
								aText.text(a.attr(isAdd == 1 ? 'data-del-tooltip' : 'data-add-tooltip'));
							}

							// Сообщение уведомления
							var content = createNoty(checkMessage(data.message), data.message, 'noty_good', '/user/favorites', 'Перейти в Избранное');

							// Если есть функция, которая отображает сообщения пользователю
							if (typeof (Noty) == 'function') {
								notyStart(content, 'success');
							}
						} else if ('error' == data.status) {
							// Сообщение уведомления
							var content = createNoty('Не удалось добавить!', data.message, 'noty_bad', '/user/login', 'Войти');
							
							// Если есть функция, которая отображает сообщения пользователю
							if (typeof (Noty) == 'function') {
								notyStart(content, 'warning');
							}
						}
					},
					error: function () {
						notyStart('Error Ajax add-favorites', 'warning');
					}
				});

				return false;
			}
		});
	}

	// Добавление товара в корзину
	this.addCart = function(){
		$('.product__form').off('submit').on('submit', function(){
			// Быстрый заказ
			if ($(this).attr('rel') === 'quick') {
				product.quickOrder(this);
				$('.cart').addClass('has-items');
				return false;
			}
			// Добавляем активные классы и обновлем счетчик товаров
			$('.cart').addClass('has-items');
			// Находим форму, которую отправляем на сервер, для добавления товара в корзину
			var formBlock = $($(this).get(0));
			// Проверка на существование формы отправки запроса на добавление товара в корзину
			if (1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
				alert('Не удалось найти форму добавления товара в корзину');
				return false;
			}
			// Получаем данные формы, которые будем отправлять на сервер
			var formData = formBlock.serializeArray();
			var t = $(this);
			var id = t.find('input[name="form[goods_id]"]').val()
			var qty = t.find('.qty__input')
			var val = qty.val()
			var mod = qty.attr('name')
			// Сообщаем серверу, что мы пришли через ajax запрос
			formData.push({name: 'ajax_q', value: 1});
			// Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
			//formData.push({name: 'fast_order', value: 1});
			// Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
			$.ajax({
				type: "POST",
				cache: false,
				url: formBlock.attr('action'),
				data: formData,
				success: function(data) {
					// Анализ системного сообщения в коризне
					var content = $(data).html();
					// Проверяем текст сообщения на наличие ошибки
					if (content.indexOf("Не удалось") != -1) {
						// Сообщение с ошибкой
						if(typeof(Noty) == "function") {
							notyStart(content, 'warning')
						}
					} else {
						// Сообщение с успешным добавлением
						if(typeof(Noty) == "function") {
							notyStart(content, 'success');
						}
						
						// Проверяем все товары в других категориях
						setTimeout(() => {
							product.inCartAll(id, mod)
						}, 100);
	
					}
					// Скрытое обновление корзины
					$('.hiddenUpdate').html(data);
				}
			});
			return false;
		});
	}

	// Функция выбора модификаций
	this.quickViewMod = function(){
		// Получение центральной разметки страницы (для быстрого просмотра)
		$(document).ready(function(){
			$.fn.getColumnContent = function(){
				var block = ($(this).length && $(this).hasClass('productViewBlock') ? $(this).filter('.productViewBlock') : $('.productViewBlock:eq(0)'));
				block.each(function(){
					// Удаляем все блоки, которые не отображаются в быстром просмотре.
					$(this).children().not('.productView').remove();
				});
				block.removeClass('productViewQuick');
				block.addClass('productViewMod');
				block.find('.productView__image img').attr('src', block.find('.productView__image img').data('src'))
				return block;
			}
			// Быстрый просмотр товара
			// При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
			$('.product__has-mod').mouseover(function(){
				// Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
				var link = $(this).find('.add-mod');
				if(link.length < 1) {
					return true;
				}
				// Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
				if(typeof(document.quickviewPreload) == 'undefined') {
					document.quickviewPreload = [];
				}
				var href = link.attr('href');
				href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
				// Если контент по данной ссылке ещё не загружен
				if(typeof(document.quickviewPreload[href]) == 'undefined') {
					// Ставим отметку о том, что мы начали загрузку страницы товара
					document.quickviewPreload[href] = 1;
					// Делаем запрос на загрузку страницы товара
					$.get(href, function(content) {
						// Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
						document.quickviewPreload[href] = $(content).getColumnContent();
					})
					// Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
					.fail(function(){
						delete document.quickviewPreload[href];
					});
				}
			});
			// Действие при нажатии на кнопку быстрого просмотра.
			$(document).on('click', '.add-mod', function(){
				var href = $(this).attr('href');
				href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
				// product.quickViewShowMod(href);
				$(function(){
					var observer = lozad();
					observer.observe();
				});
				preload();
				return false;
			});
		});
	}

	// Быстрый просмотр модификаций
	this.quickViewShowMod = function(href, atempt) {
		// Если данные по быстрому просмотру уже подгружены
		if(typeof(document.quickviewPreload[href]) != 'undefined') {
			// Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
			if(1 == document.quickviewPreload[href]) {
				// Если попытки ещё не указывались, ставим 0 - первая попытка
				if(typeof(atempt) == 'undefined') {
					atempt = 0;
					// Иначе прибавляем счётчик попыток
				} else {
					atempt += 1;
					// Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
					if(atempt > 500) {
						delete document.quickviewPreload[href];
						// TODO сделать вывод красивой таблички
						alert('Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.');
						return true;
					}
				}
				// Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится.
				setTimeout('product.quickViewShowMod("' + href + '", '+ atempt +')', 50);
				return true;
			} else {
				$.fancybox.close();
				$.fancybox.open({
					src  : document.quickviewPreload[href],
					type : 'inline',
					transitionEffect: "slide"
				});
				product.addCart();
				product.addTo();
				goods.goodsModification($('.fancybox-content.productViewBlock'));
				goods.onClick();
				quantityGoods.onGoods();
			}
		} else {
			$.get(href, function(content) {
				$.fancybox.close();
				$.fancybox.open({
					src  : $(content).getColumnContent(),
					type : 'inline',
					transitionEffect: "slide"
				});
				product.addCart();
				product.addTo();
				goods.goodsModification($('.fancybox-content.productViewBlock'));
				goods.onClick();
				quantityGoods.onGoods();
			});
		}
	}

	// Добавление товара в корзину
	this.onCart = function(){
		$('.add-cart, .add-mod').on('click', function(){
			var form = $(this).closest('form');
			if ($(this).hasClass('quick')) {
				form.attr('rel', 'quick');
			} else {
				var rel = form.attr('rel');
				if (rel) {
					form.attr('rel', rel.replace('quick', ''));
				}
			}
			form.trigger('submit');
			return false;
		});
	}

	// Уведомить при отсутствии товара
	this.onNotify = function(){
		$('.add-notify').on('click', function(){
			var formBlock = $(this).closest('.product__form');
			var goodsMod = formBlock.find('[name="form[goods_mod_id]"]').val();
			$('#fancy-notify-goods-mod').val(goodsMod)
		});
	}

	// Быстрый заказ
	this.quickOrder = function(formSelector){
		// Находим форму, которую отправляем на сервер, для добавления товара в корзину
		var formBlock = $($(formSelector).get(0));
		// Проверка на существование формы отправки запроса на добавление товара в корзину
		if(1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
			alert('Не удалось найти форму добавления товара в корзину');
			return false;
		}
		// Получаем данные формы, которые будем отправлять на сервер
		var formData = formBlock.serializeArray();
		// Сообщаем серверу, что мы пришли через ajax запрос
		formData.push({name: 'ajax_q', value: 1});
		// Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
		formData.push({name: 'fast_order', value: 1});
		// Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
		$.ajax({
			type    : "POST",
			cache	  : false,
			url		  : formBlock.attr('action'),
			data		: formData,
			success: function(data) {
				$.fancybox.open(data, {
					keyboard: false,
					baseClass: "fastOrder",
					afterShow: function(){
						password.onPass();
						password.onReg();
						password.capsWarning();
						order.onInit();
						order.onSelect();
						order.coupons();
						order.onValidate();
						cart.minSum()
						preload();
						// Стили для новых селектов
						$('.form__phone').mask('+7 (999) 999-9999');
					}
				})

			}
		});
		return false;
	}

	// Модификации
	this.changeMod = function(){
		const mods = document.querySelectorAll('.product__props-select')
		
		mods.forEach((mod) => {
			mod.addEventListener('change', () => product.updMod(mod))
		})
		
	}

	// Обновить модификацию
	this.updMod = function(mod){
		const checked = mod.querySelector('option:checked')
		const priceNow = checked.getAttribute('data-price')
		const priceOld = checked.getAttribute('data-price-old')
		const rest = checked.getAttribute('data-rest')
		const id = checked.getAttribute('value')
		const item = mod.closest('.product__item')
		const itemPriceNow = item.querySelector('.price__now .num')
		const itemPriceOld = item.querySelector('.price__old .num')
		const itemQtyInput = item.querySelector('.qty__input')
		const itemModId = item.querySelector('[name="form[goods_mod_id]"]')
		const addtoId = document.querySelector('.addto__qty .qty__input[name="form[quantity]['+ id +']"')

		itemPriceNow.innerHTML = addSpaces(Math.floor(priceNow))
		// Проверка старой цены
		itemPriceOld ? itemPriceOld.innerHTML = addSpaces(Math.floor(priceOld)) : ''
		// Обновление данных
		itemQtyInput.name = `form[quantity][${id}]`
		itemQtyInput.max = rest
		itemModId.value = id
		
		// Проверка модификации в корзине
		if (addtoId) {
			itemQtyInput.value = addtoId.value
			item.classList.add('product__inCart')
		} else {
			itemQtyInput.value = 1
			item.classList.remove('product__inCart')
		}

		// Проверка наличия
		rest > 0 ? item.classList.remove('product__empty') : item.classList.add('product__empty')

		// Обновление ссылки
		const link = item.querySelector('.add-cart')
		const linkNew = link.href.replace(/\d{9}/, id)
		link.href = linkNew
	}

}


///////////////////////////////////////
/*** Действия удаления из ... ***/
///////////////////////////////////////
function Remove() {
	// Удаление товара из корзины без обновлении страницы
	this.fromCart = function (obj){
		event.preventDefault();
		if(confirm('Вы точно хотите удалить товар из корзины?')){
			var href = obj.attr('href');
			var qty = obj.data('qty');
			var id = obj.data('id');
			var oldCount = $('.cart-count').attr('data-cart-count');
			$.ajax({
				cache  : false,
				url		 : href,
				success: function(data){
					var newCount = oldCount - qty;
					$('.cart-count').attr('data-cart-count', newCount).text(newCount);
					$('.cart-wordend').html($(data).find('.cart-wordend').html());
					$('.cartSumNow').attr('data-price', $(data).find('.cartSumNow').attr('data-price')).find('.num').text(addSpaces($(data).find('.cartSumNow').attr('data-price')));
					$('.cartSumOld').attr('data-price', $(data).find('.cartSumOld').attr('data-price')).find('.num').text(addSpaces($(data).find('.cartSumOld').attr('data-price')));
					// Скрываем и удаляем товар из корзины
					obj.parents().find('.addto__item[data-id="'+ id +'"]').fadeOut().remove();
					// Удаляем класс добавленного товара в корзину
					$('.product__item[data-id="'+ id +'"]').removeClass('product__inCart')
					$('.product__item[data-id="'+ id +'"] .qty__input').val('1')
					var flag = 0;
					if(newCount != 0){
						$('.addto__cart .addto__item').each(function(){
							if(flag == 0){
								if($(this).css('display') == 'none'){
									$(this).css('display', 'flex');
									flag++;
								}
							}
						});
					} else {
						$('.cart').removeClass('has-items');
						$('.cart-count').attr('data-cart-count', '0').text("0");
						$('.cart .addto__item').remove();
					}
				}
			});
		}
	}

	// Удаление ВСЕХ товаров из Корзины без обновлении страницы
	this.fromCartAll = function (obj){
		event.preventDefault();
		if(confirm('Вы точно хотите очистить корзину?')){
			$.ajax({
				cache  : false,
				url		 : obj.attr('href'),
				success: function(data){
					$('.totalSum').html($(data).find('.totalSum').html());
					$('.cart').removeClass('has-items');
					$('.cart-count').attr('data-cart-count', '0').text("0");
					$('.addto__cart .addto__item').remove();
					$('.product__item').each(function(){
						$(this).removeClass('product__inCart').find('.inCart__count').text('0');
						$(this).find('.qty__input').val('1')
					});
				}
			});
		}
	}

	// Удаление товара из Сравнения без обновлении страницы
	this.fromCompare = function (obj){
		event.preventDefault();
		if(confirm('Вы точно хотите удалить товар из сравнения?')){
			var href = obj.attr('href');
			var id = obj.attr('data-id');
			var oldCount = $('.compare-count').attr('data-count');
			// Скрываем и удаляем товар из корзины
			obj.parents().find('.addto__compare .addto__item[data-id="'+ id +'"]').fadeOut().remove();
			$.ajax({
				cache : false,
				url		: href,
				success: function(data){
					var newCount = oldCount - 1;
					$('.compare-count').attr('data-count', newCount).text(newCount);
					var flag = 0;
					if(newCount != 0){
						$('.addto__compare .addto__item').each(function(){
							if(flag == 0){
								if($(this).css('display') == 'none'){
									$(this).css('display', 'flex');
									flag++;
								}
							}
						});
					}else{
						$('.compare').removeClass('has-items');
						$('.compare-count').attr('data-count', '0').text('0');
					}

					var obj = $('.add-compare[data-id="' + id + '"]');
					if(obj.length) {
						obj.attr("data-action-is-add", "1")
						.removeAttr("title")
						.removeClass("added")
						.attr("href", obj.attr("href")
						.replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
					}
				}
			});
		}
	}

	// Удаление ВСЕХ товаров из Сравнения без обновлении страницы
	this.fromCompareAll = function (obj){
		event.preventDefault();
		if(confirm('Вы точно хотите очистить сравнение?')){
			$.ajax({
				cache  : false,
				url		 : obj.attr('href'),
				success: function(data){
					$('.compare').removeClass('has-items');
					$('.compare-count').attr('data-count', '0').text("0");
					$('.addto__compare .addto__item').remove();
					$('.add-compare').removeAttr("title").removeClass("added");
				}
			});
		}
	}

	// Удаление товара из Избранного без обновлении страницы
	this.fromFavorites = function (obj){
		event.preventDefault();
		if(confirm('Вы точно хотите удалить товар из Избранного?')){
			var href = obj.attr('href');
			var id = obj.attr('data-id');
			var oldCount = $('.favorites-count').attr('data-count');
			// Скрываем и удаляем товар из корзины
			obj.parents().find('.addto__favorites .addto__item[data-id="'+ id +'"]').fadeOut().remove();
			$.ajax({
				cache : false,
				url		: href,
				success: function(data){
					var newCount = oldCount - 1;
					$('.favorites-count').attr('data-count', newCount).text(newCount);
					var flag = 0;
					if(newCount != 0){
						$('.addto__favorites .addto__item').each(function(){
							if(flag == 0){
								if($(this).css('display') == 'none'){
									$(this).css('display', 'flex');
									flag++;
								}
							}
						});
					}else{
						$('.favorites').removeClass('has-items');
						$('.favorites-count').attr('data-count', '0').text('0');
					}
					var obj = $('.add-favorites[data-id="' + id + '"]');
					if(obj.length) {
						obj.attr("data-action-is-add", "1")
						.removeAttr("title")
						.removeClass("added")
						.attr("href", obj.attr("href")
						.replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
					}
				}
			});
		}
	}

	// Удаление ВСЕХ товаров из Избранного без обновлении страницы
	this.fromFavoritesAll = function (obj){
		event.preventDefault();
		if(confirm('Вы точно хотите очистить Избранное?')){
			$.ajax({
				cache  : false,
				url		 : obj.attr('href'),
				success: function(d){
					$('.favorites').removeClass('has-items');
					$('.favorites-count').attr('data-count', '0').text("0");
					$('.addto__favorites .addto__item').remove();
					$('.add-favorites').removeAttr("title").removeClass("added");
				}
			});
		}
	}

}


///////////////////////////////////////
/*** Скрипты для Товары, Категории ***/
///////////////////////////////////////
function Catalog() {

	var content = document.querySelector('#main')

	// Функции при клике на фильтры
	this.onClick = function(){
		// Если нет контента
		if(!content){
			return false
		}
		
		content.addEventListener('click', function(event){
			// Объявление переменных
			var filterInput = event.target.closest('.filter__item input');
			var filterTitle = event.target.closest('.filter__collapsible .filter__title');
			var filterClear = event.target.closest('.filter__clear')
			var filterIcon = event.target.closest('.filters__icon')

			// Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
			if (filterInput){
				$(event.target)[0].form.submit();
			}
			// Открытие/Скрытие фильтров в сайдбаре
			else if (filterTitle){
				event.preventDefault();
				var parent = $(filterTitle).parent();
				if (parent.hasClass('is-actived')) {
					parent.find('.filter__content').slideUp(600);
					parent.removeClass('is-actived');
				} else {
					parent.find('.filter__content').slideDown(600);
					parent.addClass('is-actived');
				}

			}
			// Сборосить категорию фильтра
			else if (filterClear){
				event.preventDefault();
				var parent = $(event.target).closest('.filter__list');
				var checkboxes = parent.find('[type="checkbox"]')
				checkboxes.prop('checked', false).attr('checked', false);
				$('.form__filters')[0].submit();

			}
			// Открыть фильтры по иконке
			else if (filterIcon){
				event.preventDefault();
				$(event.target).toggleClass('is-opened');
				$('.sidebar__block-filters').toggleClass('is-opened');
				$('#overlay').toggleClass('is-opened transparent');

			}
		});

	}

	// Фильтр по ценам
	this.priceFilter = function(){

		var
			priceFilterMinAvailable = parseInt($('.goodsFilterPriceRangePointers .min').text()),  // Минимальное значение цены для фильтра
			priceFilterMaxAvailable = parseInt($('.goodsFilterPriceRangePointers .max').text()),  // Максимальное значение цены для фильтра
			priceSliderBlock = $('#goods-filter-price-slider'), // Максимальное значение цены для фильтра
			priceInputMin = $("#goods-filter-min-price"), // Поле ввода текущего значения цены "От"
			priceInputMax = $("#goods-filter-max-price"), // Поле ввода текущего значения цены "До"
			priceSubmitButtonBlock = $(".goodsFilterPriceSubmit");  // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.

		// Слайдер, который используется для удобства выбора цены
		priceSliderBlock.slider({
			range: true,
			min: priceFilterMinAvailable,
			max: priceFilterMaxAvailable,
			values: [
				parseInt($('#goods-filter-min-price').val())
				,parseInt($('#goods-filter-max-price').val())
			],
			slide: function( event, ui ) {
				priceInputMin.val( ui.values[ 0 ] );
				priceInputMax.val( ui.values[ 1 ] );
				priceSubmitButtonBlock.css('display', 'flex');
			}
		});
		// При изменении минимального значения цены
		priceInputMin.keyup(function(){
			var newVal = parseInt($(this).val());
			if(newVal < priceFilterMinAvailable) {
				newVal = priceFilterMinAvailable;
			}
			priceSliderBlock.slider("values", 0, newVal);
			priceSubmitButtonBlock.css('display', 'flex');
		});
		// При изменении максимального значения цены
		priceInputMax.keyup(function(){
			var newVal = parseInt($(this).val());
			if(newVal > priceFilterMaxAvailable) {
				newVal = priceFilterMaxAvailable;
			}
			priceSliderBlock.slider("values", 1, newVal);
			priceSubmitButtonBlock.css('display', 'flex');
		});

		// Активный фильтр цены
		if (priceInputMin.val() > priceFilterMinAvailable || priceInputMax.val() < priceFilterMaxAvailable) {
			$('.filters-price').addClass('has-filters');
			$('.sidebar__block-filters').addClass('has-filters');
		}else{
			$('.filters-price').removeClass('has-filters');
		}

	}

	// Счетчик активных фильтров
	this.activeFilterCount = function(){
		var count = $('.toolbar__form input[name^="form[filter][attr]"]').length;
		var result = $('.filters__result')
		result.attr('data-result', count).text(count)
		count == 0 ? result.addClass('is-hide') : result.removeClass('is-hide')
	}

	// Скрыть каталог если нет подкатегорий
	this.hideSideCatalog = function(){
		var items = $('.sidebar__block-catalog .catalog__item')
		if (items.length < 2 ) {
			$('.sidebar__block-catalog').hide();
		}
	}

}


///////////////////////////////////////
// Товар. Карточка товара
///////////////////////////////////////
function Goods() {
	// Слайдер доп. изображений
	this.swiperTumbs = function(){
		var id = '.productView__images'
		// Слайдер товаров
		var swiper = new Swiper(id + ' .swiper', {
			loop: false,
			autoplay: false,
			watchSlidesVisibility: true,
			simulateTouch: true,
			grabCursor: true,
			slidesPerView: '1',
			spaceBetween: 0,
			nested: true,
			autoHeight: false,
			preloadImages: false,
			lazy: {
				enabled: false,
				loadPrevNext: true,
				loadOnTransitionStart: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: id + ' .swiper-pagination',
				type: 'bullets',
				dynamicBullets: true,
				dynamicMainBullets: 1,
				clickable: true,
			},
		});

		// Скрываем навигацию если слайдер заблокирован
		if($(id).find('.swiper-button-disabled').length == 2){
			$(id).find('.swiper-navigate').addClass('swiper-navigation-lock')
		}else{
			$(id).find('.swiper-navigate').removeClass('swiper-navigation-lock')
		}
	}

	// Функции при инициализации товара
	this.onInit = function(){

		// Добавление отзыва о товаре. Рейтинг
		if($('.goodsOpinionRating').length){
			$('.goodsOpinionRating').rating();
		}

		goods.hideOpinion()
		goods.hideFeatures()
		goods.hideText()
		goods.hideDescription()
		goods.opinionBar()
		goods.opinionAvatar()

		// Выбор модификации
		// $('.modifications-props').each(function(){
		// 	a = $(this).find('select option:selected').attr('value');
		// 	$(this).find('.modifications__value[data-value="'+ a +'"]').addClass('is-actived');
		// 	$(this).find('select option:disabled').each(function(){
		// 		dis = $(this).attr('value');
		// 		$('.modifications__value[data-value="'+ dis +'"]').addClass('is-disabled');
		// 	});
			
		// });		

	}

	// Скрываем отзывы если их много
	this.hideOpinion = function(){
		var item = $('.opinion__item').length
		var visible = $('.opinion__item:visible').length
		var button = $('.opinion__buttons')
		// Скрываем кнопку
		item > visible ? button.show() : button.hide()
	}

	// Скрываем хар-ки если их много
	this.hideFeatures = function(){
		var item = $('.features__item').length
		var visible = $('.features__item:visible').length
		var button = $('.features__more')
		// Скрываем кнопку
		item > visible ? button.show() : button.hide()
	}

	// Скрываем большое краткое описание
	this.hideText = function(){
		var content = $('.productView__text-content')
		var height = content.height()
		if (height > 129){
			content.addClass('mask')
			content.next().removeClass('is-hide')
		}
	}

	// Скрываем большое краткое описание
	this.hideDescription = function(){
		var content = $('.productView__description-content')
		var height = content.height()
		if (height > 129){
			content.addClass('mask')
			content.next().removeClass('is-hide')
		}
	}

	// Скрываем большое краткое описание
	this.scrollContent = function($content, $obj){
		// var scrollTop = $content.offset().top + $content.height() - $(window).height();
		if ($obj.hasClass('is-actived')) {
			$('html, body').animate({scrollTop : $content.offset().top - 96}, 500);
		} else {
			$('html, body').animate({scrollTop : $content.offset().top - 96}, 500);
		}
	}

	// Хорошие/Плохие отзывы
	this.opinionBar = function(){
		$('.opinion__total-count').each(function(){
			var cnt_all = $(this).attr('content');
			var cnt_this =  $(this).text();
			var total = Math.floor(parseInt(cnt_this) / parseInt(cnt_all) * 100)
			$(this).css({width: total+'%'})
		})
	}

	// Первая буква имени в аватаре
	this.opinionAvatar = function(){
		$('.opinion__item').each(function(){
			var avatar = $(this).find('.opinion__avatar span');
			var name = $(this).find('.opinion__name span').text()[0];
			avatar.text(name)
		})
	}

	// Навигация
	this.opinionNavigate = function($obj, $nav){
		$obj.find('[data-nav]').removeClass('is-actived')
		$obj.find('[data-nav='+ $nav +']').addClass('is-actived')
		$obj.find('[data-nav-content]').removeClass('is-show').addClass('is-hide')
		$obj.find('[data-nav-content='+ $nav +']').removeClass('is-hide').addClass('is-show')
		$obj.find('.opinion__buttons').addClass('is-hide')

		if ($nav == 'all'){
			$obj.find('[data-nav-content]').removeClass('is-hide').addClass('is-show')
			$obj.find('.opinion__buttons').removeClass('is-hide').addClass('is-show')
			goods.hideOpinion()
		}
	}

	// Действия при клике
	this.onClick = function(){
		
		var content = document.querySelector('.productViewBlock')
		// Если нет контента
		if(!content){
			return false
		}
		
		content.addEventListener('click', function(event){
			// Объявление переменных
			var generally = event.target.closest('.generally label');
			var opinionNav = event.target.closest('.opinion__nav');
			var opinionAdd = event.target.closest('.opinion__add');
			var opinionForm = event.target.closest('.opinion__form button');
			var opinionCaptcha = event.target.closest('.captcha__refresh');
			var opinionMore = event.target.closest('.opinion__more');
			// var modValue = event.target.closest('.modifications__value');
			var featuresMore = event.target.closest('.features__more');
			var descriptionMore = event.target.closest('.productView__description-more');
			var shortDescriptionMore = event.target.closest('.productView__text-more');
			var totalGood = event.target.closest('.opinion__total-good .opinion__total-label');
			var totalBad = event.target.closest('.opinion__total-bad .opinion__total-label');

			// Переключение для Положительный/Отрицательный отзыв
			if (generally){
				event.preventDefault();
				var id = $(event.target.parentElement).attr('for')
				var parents = $(event.target.offsetParent)

				parents.find('.generally input').prop('checked', false)
				parents.find('.generally input#' + id).prop('checked', true)

			}
			// Переключение для Положительный и Отрицательный отзыв
			else if (opinionNav){
				var obj = $(event.target.offsetParent)
				var nav = $(opinionNav).attr('data-nav')

				goods.opinionNavigate(obj, nav)

			}
			// Ссылка на отображение формы для добавление отзыва о товаре
			else if (opinionAdd){
				event.preventDefault();
				if ($(opinionAdd).hasClass('is-actived')) {
					$(opinionAdd).removeClass('is-actived');
					$('.opinion__addForm').slideUp(600);
				}else{
					$(opinionAdd).addClass('is-actived');
					$('.opinion__addForm').slideDown(600);
					$('html, body').animate({scrollTop : $('.opinion__addForm').offset().top}, 500);
				}

			}
			// Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
			else if (opinionForm){
				var form = $('.opinion__form');
				form.validate({
					errorPlacement: function(error, element) { }
				});
				form.submit();

			}
			// Иконка для обновления изображение капчи
			else if (opinionCaptcha){
				goods.RefreshImageAction(event.target,1,1);
				$('.captcha__image').attr('src',$('.captcha__image').attr('src')+'&rand'+Math.random(0,10000));

			}
			// Функция показать больше для Отзывов
			else if (opinionMore){			
				var content = $('.opinion__container')
				var obj = $(event.target.parentElement)
				obj.toggleClass('is-actived')
				changeTxt(obj.find('span'))
				$('.opinion__items').toggleClass('is-show')
				// Скрол контента
				goods.scrollContent(content, obj)

			}
			// Хар-ки
			else if (featuresMore){
				var content = $('.productView__features');
				var obj = $(event.target.parentElement)
				obj.toggleClass('is-actived')
				changeTxt(obj.find('span'))
				$('.features__items').toggleClass('is-show')
				// Скрол контента
				goods.scrollContent(content, obj)

			}
			// Описание
			else if (descriptionMore){
				var content = $('.productView__description');
				var obj = $(event.target.parentElement)
				obj.toggleClass('is-actived')
				changeTxt(obj.find('span'))
				$('.productView__description-content').toggleClass('mask')
				// Скрол контента
				goods.scrollContent(content, obj)

			}
			// 
			else if (shortDescriptionMore) {
				var content = $('.productView__text');
				var obj = $(event.target.parentElement)
				obj.toggleClass('is-actived')
				changeTxt(obj.find('span'))
				$('.productView__text-content').toggleClass('mask')
			}
			// Хорошие отзывы
			else if (totalGood){
				var obj = $(event.target.offsetParent)
				goods.opinionNavigate(obj, 'good')

			}
			// Плохие отзывы
			else if (totalBad){
				var obj = $(event.target.offsetParent)
				goods.opinionNavigate(obj, 'bad')

			}
			// Новый модификации
			// else if (modValue){
			// 	event.preventDefault();
			// 	goods.newModification($(event.target.parentElement))
			// }

		});

	}

	// Крутит изображение при обновлении картинки защиты от роботов
	this.RefreshImageAction = function(img,num,cnt){
		if(cnt>13) { return false; }
		$(img).attr('src', $(img).attr('rel') + 'icon/refresh/' + num + '.gif');
		num = (num==6)?0:num;
		setTimeout(function(){
			goods.RefreshImageAction(img, num+1, cnt+1)
		}, 50);
	}

	
	// // Инициализация табов на странице товара
	// this.initTabs = function(){
	// 	// Блок в котором находятся табы
	// 	var tabs = $('.productView__tabs');
	// 	if(!tabs.length) {
	// 		return false;
	// 	}
	// 	// Добавляем аткивные классы на первый элемент
	// 	tabs.find('[data-tab]').first().addClass('is-actived');
	// 	tabs.find('[data-tab-content]').first().addClass('is-show');
	// 	// Проверяет хэш и если по нему была открыта вкладка, то эта функция автоматически откроет её.
	// 	goods.checkTabHash();
	// 	// Если используется хеш, то скролим до контента
	// 	if(document.location.hash !== '') {
	// 		$('html, body').animate({scrollTop : jQuery('.tabs__content').offset().top - 68}, 600);
	// 	}
	// 	// Биндим изменение хэша - проверка какой таб нужно открыть.
	// 	$(window).bind('hashchange', function(){ goods.checkTabHash(); });
	// }

	// // Переключение табов
	// this.tabSwitch = function(nb){
	// 	var tabs = $('.productView__tabs');
	// 	var tab = tabs.find('[data-tab="'+ nb +'"]');
	// 	var content = tabs.find('[data-tab-content="'+ nb +'"]');
	// 	tabs.find('[data-tab]').removeClass('is-actived');
	// 	tabs.find('[data-tab-content]').removeClass('is-show');
	// 	tab.addClass('is-actived');
	// 	content.addClass('is-show');
	// 	document.location.hash = "#tab_" + nb;
	// }

	// // Проверяет хэш, переданый пользователем и открывает соответствующий раздел
	// this.checkTabHash = function(){
	// 	// Определяем текущий хэш страницы
	// 	var hash = window.location.hash.substr(1);
	// 	if(hash == 'goodsDataOpinionAdd') {
	// 		hash = 'tab_4';
	// 	}
	// 	if(!hash.length || hash.indexOf('tab_') == -1) {
	// 		return false;
	// 	}
	// 	// Открываем тот таб, который был указан в hash-е
	// 	goods.tabSwitch(hash.replace("tab_", ''))
	// }

	// Модификации select
	this.goodsModification = function(obj){
		// Функция собирает свойства в строку, для определения модификации товара
		function getSlugFromGoodsDataFormModificationsProperties(obj) {
			var properties = new Array();
			$(obj).each(function(i){
				properties[i] = parseInt($(this).val());
			});
			return properties.sort(function(a,b){
				return a - b
			}).join('_');
		}

		var $parentBlock = obj || $('#main .productViewBlock')

		var
			goodsDataProperties = $parentBlock.find('.modifications-props select[name="form[properties][]"]'),  // Запоминаем поля выбора свойств, для ускорения работы со значениями свойств
			goodsDataModifications = $parentBlock.find('.goodsModificationsSlug'); // Запоминаем блоки с информацией по модификациям, для ускорения работы

		// Обновляет возможность выбора свойств модификации, для отключения возможности выбора по характеристикам модификации которой не существует.
		function updateVisibility (y) {
			// Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
			goodsDataProperties.each(function(j){
				// Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
				if( j != y ) {
					// Проходим по всем значениям текущего свойства модификации товара
					$(this).find('option').each(function(){
						// Записываем временный массив свойств, которые будем использовать для проверки существования модификации
						var checkProperties = new Array();
						$(goodsDataProperties).each(function(i){
							checkProperties[i] = parseInt($(this).val());
						});
						// Пытаемся найти модификацию соответствующую выбранным значениям свойств
						checkProperties[j] = parseInt($(this).attr('value'));
						// Собираем хэш определяющий модификацию по свойствам
						slug = checkProperties.sort(function(a,b){return a - b}).join('_');
						// Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
						if(!goodsDataModifications.filter('[rel="'+slug+'"]').length) {
							$(this).attr('disabled', true);
							// Если выбрав данное значение свойства товара можно подобрать модификацию, то выделяем вариант выбора как доступный.
						} else {
							$(this).attr('disabled', false);
						}
					});
				}
			});
		}
		// Обновляем возможность выбора модификации товара по свойствам. Для тех свойств, выбор по которым не возможен, отключаем такую возможность.
		// Проверяем возможность выбора на всех полях кроме первого, чтобы отключить во всех остальных варианты, которые не возможно выбрать
		updateVisibility (0);
		// Проверяем возможность выбора на всех полях кроме второго, чтобы в первом поле так же отключилась возможность выбора не существующих модификаций
		updateVisibility (1);

		// Изменение цены товара при изменении у товара свойства для модификации
		goodsDataProperties.each(function(y){
			function slugUpdate(){
				var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
					goodsModView                  = $parentBlock.find('.productView'),
					modificationBlock             = goodsModView.find('.goodsModificationsSlug[rel="'+slug+'"]'),
					modificationId                = parseInt(modificationBlock.find('[name="id"]').val()),
					modificationArtNumber         = modificationBlock.find('[name="art_number"]').val(),
					modificationPriceNow          = parseInt(modificationBlock.find('[name="price_now"]').val()),
					modificationPriceNowFormated  = modificationBlock.find('.price_now_formated').html(),
					modificationPriceOld          = parseInt(modificationBlock.find('[name="price_old"]').val()),
					modificationPriceOldFormated  = modificationBlock.find('.price_old_formated').html(),
					modificationRestValue         = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
					modificationMeasure         	= modificationBlock.find('[name="measure_name"]').val(),
					modificationDescription       = modificationBlock.find('.description').html(),
					modificationGoodsModImageId   = modificationBlock.find('[name="goods_mod_image_id"]').val(),
					goodsModificationId           = goodsModView.find('.goodsModificationId')
					goodsPriceNow                 = goodsModView.find('.price__now'),
					goodsPriceOld                 = goodsModView.find('.price__old'),
					goodsAvailableQty             = goodsModView.find('.productView__qty'),
					goodsModQty              			= goodsModView.find('.qty__input'),
					goodsArtNumberBlock           = goodsModView.find('.productView__articles'),
					goodsArtNumber                = goodsModView.find('.goodsModArtNumber'),
					goodsModDescription     			= goodsModView.find('.modifications__description'),
					goodsModRestValue             = goodsModView.find('.goodsModRestValue');
					
				// Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
				if(modificationBlock.length) {
					// Цена товара
					goodsPriceNow.html(modificationPriceNowFormated);
					goodsPriceNow.attr('data-price', modificationPriceNow).attr('content', modificationPriceNow);

					// Старая цена товара
					if(modificationPriceOld>modificationPriceNow) {
						goodsPriceOld.removeClass('is-hide');
						goodsPriceOld.html(modificationPriceOldFormated);
						goodsPriceOld.parent().addClass('has-price-old')
					} else {
						goodsPriceOld.addClass('is-hide');
						goodsPriceOld.html('');
						goodsPriceOld.parent().removeClass('has-price-old')
					}

					// Есть ли товар есть в наличии. Много Мало Отсутствует 
					if(modificationRestValue > 0) {
						goodsModView.removeClass('productView__empty');
						goodsModRestValue.parent().removeClass('rest-alot').removeClass('rest-zero').addClass('rest-few');

						// Если остаток больше 9
						if(modificationRestValue > 9){
							goodsModRestValue.parent().removeClass('rest-few').removeClass('rest-zero').addClass('rest-alot');						
						}

						// Если включено в настройках "Отключить возможность класть в корзину больше товара, чем есть в наличии"
						if (goodsAvailableQty.hasClass('.has-max')) {
							goodsModQty.val("1").attr('max', modificationRestValue);
						} else {
							goodsModQty.val("1").attr('max', 99999);
						}
						
						// Обновляем кол-во и меру 
						goodsModRestValue.find('b').text(modificationRestValue +' '+ modificationMeasure);

					} else {
						// Нет в наличии
						goodsModView.addClass('productView__empty');
						goodsModRestValue.parent().removeClass('rest-few').removeClass('rest-zero').addClass('rest-zero');
						goodsModRestValue.attr('data-value', modificationRestValue);
						goodsModRestValue.find('b').text('Нет');
						goodsModQty.val("1").attr('max', 1);
					}

					// Покажем артикул модификации товара, если он указан
					if(modificationArtNumber.length > 0) {
						goodsArtNumberBlock.show();
						goodsArtNumber.html(modificationArtNumber);
					} else {
						goodsArtNumberBlock.hide();
						goodsArtNumber.html('');
					}

					// Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
					if(modificationDescription.length > 0) {
						goodsModDescription.show().html('<div>' + modificationDescription + '</div>');
					} else {
						goodsModDescription.hide().html();
					}

					// Идентификатор товарной модификации
					goodsModificationId.val(modificationId);
					goodsModView.find('.goodsDataMainModificationId').val('1')
					goodsModView.find('.goodsDataMainModificationId').attr('name','form[goods_mod_id][' + modificationId + ']');
					var goodsDataMainImage = goodsModView.find('.productView__images');

					// Меняет главное изображение товара на изображение с идентификатором goods_mod_image_id
					function changePrimaryGoodsImage(goods_mod_image_id) {
						// Если не указан идентификатор модификации товара, значит ничего менять не нужно.
						if(1 > goods_mod_image_id) {
							return true;
						}
						var
							// Блок с изображением выбранной модификации товара
							goodsModImageBlock = goodsDataMainImage.find('[data-id="' + parseInt(goods_mod_image_id) + '"'),
							// Блок, в котором находится главное изображение товара
							MainImageBlock = goodsDataMainImage.find('.productView__image'),
							// Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
							MediumImageUrl = goodsModImageBlock.attr('data-href'),
							// Главное изображение, в которое будем вставлять новое изображение
							MainImage = MainImageBlock.find('img');
						// Если изображение модификации товара найдено - изменяем главное изображение
						MainImage.attr('src', MediumImageUrl).parent().attr('href', MediumImageUrl);
						// Изменяем идентификатор главного изображения
						MainImageBlock.attr("data-id", parseInt(goods_mod_image_id));
						return true;
					}

					// Обновляем изображние модификации товара, если оно указано
					changePrimaryGoodsImage(modificationGoodsModImageId);
				} else {
					// Отправим запись об ошибке на сервер
					sendError('no modification by slug '+slug);
					alert('К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам.');
				}
				// Обновляем возможность выбора другой модификации для текущих значений свойств модификации товара.
				updateVisibility(y);
			}

			$(this).change(function(){
				slugUpdate()
			});

		});

	}

	// Кнопки для модификаций
	// this.newModification = function($obj){

	// 	if($obj.hasClass('is-disabled')){
	// 		return false;
	// 	}

	// 	$obj.parents().find('.modifications__value').removeClass('is-disabled is-actived')
	// 	$obj.addClass('is-actived');
	// 	var val = $obj.data('value');
	// 	$obj.parents().find('.modifications-props__select option[value="' + val + '"]').prop('selected',true);
	// 	$obj.parents().find('.modifications-props__select').trigger('change');

	// }

}


///////////////////////////////////////
// Корзина
///////////////////////////////////////
function Cart() {
	// Функции при клике
	this.onClick = function(){
		var content = document.querySelector('.page-cart')
		// Если нет контента
		if(!content){
			return false
		}
		
		content.addEventListener('click', function(event){
			// Объявление переменных
			var remove = event.target.closest('.cartTable__remove');
			var start = event.target.closest('.startOrder')
			var close = event.target.closest('.closeOrder')
			var clear = event.target.closest('.cartTable__clear')
			var make = event.target.closest('.confirmOrder')
			var title = event.target.closest('.cartTable__title')

			if (title){
				$(title).toggleClass('is-actived')
				$(title).next().slideToggle()
			} else if (remove){
				cart.removeItem($(event.target.parentElement))
			} else if (start){
				cart.orderStart();
			} else if (close){
				cart.orderClose();
			} else if (make){
				event.preventDefault()
				var form = $(".order_fast__form");
				form.validate({
					errorPlacement: function(error, element) { }
				});
				form.submit();
			} else if (clear){
				var yep = confirm('Вы действительно хотите удалить все товары из корзины?');
				if(yep == true){
					return true
				} else {
					event.preventDefault()
					return false
				}
			}
		});

	}

	// Удаление товара из корзины
	this.removeItem = function(event){
		var yep = confirm('Вы точно хотите удалить товар из корзины?');
		if(yep == true){
			event.closest('.cartTable__item').fadeOut();
			url = event.data('href');
			$.ajax({
				url:url,
				cache:false,
				success:function(data){
					$('.page-cart').html($(data).find('.page-cart').html());
					// Вызов функции быстрого заказа в корзине
					cart.minSum();
				}
			});
		}else{
			return false;
		}
	}

	// Функция вычисления остатка до минимальной суммы заказа
	this.minSum = function(){
		if($('.cartTotal__min').length) {
			var minPrice = parseInt($('.cartTotal__min-price').attr('data-price'));
			var totalSum = parseInt($('.cartTotal__min-title').attr('data-price'));
			if(minPrice > totalSum) {
				var diff = minPrice - totalSum
				var bar = Math.floor(totalSum / minPrice * 100)
				$('.cartTotal__min-bar').css({'width': bar+'%'})
				$('.cartTotal__min-price').find('.num').text(addSpaces(diff))
				$('.total__buttons button').not('.confirmOrder').attr('disabled', true).addClass('is-disabled');
				$('.cartTotal__min').removeClass('is-hide');
			}else{
				$('.total__buttons button').not('.confirmOrder').attr('disabled', false).removeClass('is-disabled');
				$('.cartTotal__min').addClass('is-hide');
			}
		}
	}

	// Функция быстрого оформления заказа в корзине
	this.orderStart = function(){
		var globalOrder = $('.cartTable__order');
		var pageCart = $('.page-cart');
		//объект блока куда будет выводиться форма быстрого заказа
		var OrderAjaxBlock = $('.cartTable__ajax');
		var urlQuickForm = '/cart/add'; // адрес страницы с формой
		// данные которые отарвятся на сервер чтобы получить только форму быстрого заказа без нижней части и верхней части сайта
		var quickFormData = [
			{name: 'ajax_q', value: 1},
			{name: 'fast_order', value: 1}
		];
		pageCart.addClass('is-started');
		$('.qty__input').attr('readonly', 'readonly');
		globalOrder.show('slow');
		$.ajax({
			type: "POST",
			cache: false,
			url: urlQuickForm,
			data: quickFormData,
			success: function(data) {
				OrderAjaxBlock.html($(data).find('.order_fast__content').wrap('<div></div>').html()).show('slow');
				$('html, body').delay(400).animate({scrollTop : globalOrder.offset().top - 96 - 48}, 800);
				preload();
				password.onPass();
				password.onReg();
				password.capsWarning();
				order.onInit();
				order.onSelect();
				order.coupons();
				order.onValidate();

				// Стили для новых селектов
				$('.form__phone').mask('+7 (999) 999-9999');

				// Выключение кнопки оформления заказа если не все поля заполнены
			}
		});
		return false;
	}

	// Отменить заказ
	this.orderClose = function(){
		$('.page-cart').removeClass('is-started');
		$('.qty__input').removeAttr('readonly');
		$('.startOrder').removeClass('is-disabled');
		$('.cartTable__order').hide('slow');
		$('.cartTable__items').show()
		$('html, body').delay(400).animate({scrollTop : jQuery('#main').offset().top}, 800);
	}

}


///////////////////////////////////////
/* Скрипты для оформления заказов */
///////////////////////////////////////
function Order(){
	
	// Валидация формы в оформлении заказа
	this.onValidate = function(){
		// Валидация формы
		$('.order_fast__form').validate({
			validClass: "valid",
			errorPlacement: function(error, element) {}
		});

		// Выключение кнопки оформления заказа если не все поля заполнены
		$(".order_fast__form [required]").on('input', function(){
			if($('.order_fast__form').valid()) {
				$('.total__buttons button').attr('title', 'Оформить заказ').removeClass('is-disabled');
			} else {
				$('.total__buttons button').attr('title', 'Заполните все поля').addClass('is-disabled');
			}
		});

		// Проверка обязательных полей
		setTimeout(() => {
			if($('.order_fast__form').valid()) {
				$('.total__buttons button').attr('title', 'Оформить заказ').removeClass('is-disabled');
			}else{
				$('.total__buttons button').attr('title', 'Заполните все поля').addClass('is-disabled');
				$(".order_fast__form input, .order_fast__form textarea, .order_fast__form select").removeClass('error');
			}
		}, 100);

	}

	// Регистрация и выбор доставки
	this.onInit = function(){
		// Выбор даты доставки. Документация к плагину //t1m0n.name/air-datepicker/docs/index-ru.html
		$('#deliveryConvenientDate').datepicker({
			// Если true, то при активации даты, календарь закроется.
			autoClose: true,
			// Можно выбрать только даты, идущие за сегодняшним днем, включая сегодня
			minDate: new Date()
		});
		
		// Действия при выборе варианта доставки на этапе оформления заказа
		$('.order-delivery__radio').on('click', function(d){
			// Отображение вариантов оплаты при выборе доставки
			var ID = $('input[name="form[delivery][id]"]:checked').val();
			$('.order-payment').hide();
			$('.order-payment[rel="' + ID + '"]').show();
			$('.order-payment[rel="' + ID + '"]').find('input:first').click();

			$('.order-delivery__radio').each(function(){
				$(this).prop('checked',false);
				$(this).parent().removeClass('is-actived');
			});

			$('.order-delivery-zone__radio').each(function(){
				$(this).prop('checked',false);
				$(this).parent().removeClass('is-actived');
			});

			var val = $(this).val();
			var fz = $($('.order-delivery-zone__radio[data-id='+val+']')[0]);
			$(this).prop('checked',true);
			fz.prop('checked',true);
			$(this).parent().addClass('is-actived');
			
			var price = $(this).attr('price');
			var priceBlock = $('.order-delivery__item[data-id='+ val +']').find('.order-delivery__price').find('.num');
			// Обновление цены при наличии зоны
			var cartSumTotal = $('.cartSumDelivery .num')
			var zonePrice =  $('.order-delivery-zone__radio:checked').attr('price');
			if(zonePrice > 0){
				priceBlock.text(addSpaces(zonePrice));
				cartSumTotal.text(addSpaces(zonePrice));
			}else{
				priceBlock.text(price);
				cartSumTotal.text(addSpaces(price));
			}

			// Обновление цены с учетом доставки
			var cartSumDiscount = $('.cartSumDiscount:eq(0) .num').text().toString().replace(/\s/g, '');
			var newSum = parseInt(cartSumDiscount) + parseInt(priceBlock.text());
			$('.cartSumTotal .num').text(addSpaces(newSum));

			// Скрытие необязательных полей при выборе самовывоза
			if($(this).data('name') == 'Самовывоз'){
				$('.order_fast__form').addClass('pickup');
				$('.address input, .address textarea').val('Самовывоз');
				$('#deliveryConvenientDate').val('01.01.2220');
				$('.total__buttons button').attr('title', 'Оформить заказ').removeClass('is-disabled');
			}else{
				$('.order_fast__form').removeClass('pickup');
				$('.address input, .address textarea').val('');
				$('#deliveryConvenientDate').val('');
			}

		});

		// Действия при выборе зоны внутри варианта доставки на этапе оформления заказа
		$('.order-delivery-zone__radio').on('click', function(){
			var val = $(this).attr('data-id');
			var price = $(this).attr('price');
			var priceBlock = $('.order-delivery__item[data-id='+ val +']').find('.order-delivery__price').find('.num');
			// Обновление цены
			priceBlock.text(addSpaces(price));
			
			$('.order-delivery__radio').each(function(){
				$(this).prop('checked',false);
				if($(this).val() == val){
					$(this).prop('checked',true);
				}else{
					$(this).prop('checked',false);
				}
			});

			// Выбор варианта оплаты при выборе зоны доставки
			var ID = $('input[name="form[delivery][id]"]:checked').val();
			$('.order-payment').hide();
			$('.order-payment[rel="' + ID + '"]').show();
			$('.order-payment[rel="' + ID + '"]').find('input:first').click();

			// Обновление цены с учетом доставки
			var cartSumDiscount = $('.cartSumDiscount:eq(0) .num').text().toString().replace(/\s/g, '');
			var newSum = parseInt(cartSumDiscount) + parseInt(priceBlock.text());
			$('.cartSumTotal .num').text(addSpaces(newSum));
			$('.cartSumDelivery .num').text(addSpaces(price));
		});

		// Выбор оплаты по клику
		$('.order-payment__radio').on('click', function(){
			var paymentDescription = $('.order-payment__radio:checked').parent().find('.order-payment__desc').html();
			var payDesc = $('.order-payment__desc');
			payDesc.html(paymentDescription);
			if (paymentDescription == undefined ) {
				payDesc.addClass('is-hide').removeClass('is-show')
			}else{
				payDesc.addClass('is-show').removeClass('is-hide')
			}
		});

		// Выбор оплаты по умолчанию
		$('.order-payment__radio').each(function(){
			var paymentDescription = $('.order-payment__radio:checked').parent().find('.order-payment__desc').html();
			var payDesc = $('.order-payment__desc');
			payDesc.html(paymentDescription);
			if (paymentDescription == undefined ) {
				payDesc.addClass('is-hide').removeClass('is-show')
			}else{
				payDesc.addClass('is-show').removeClass('is-hide')
			}
		});

		setTimeout(function(){
			$('.order-delivery__select').trigger('change')			
		}, 100);
 
	}

	// Выбор доставки и оплаты
	this.onSelect = function(){
		// Выбор доставки
		$('.order-delivery__select').on('change', function(){
			var selectedDelId = $('.order-delivery__select').find('option:selected').attr('data-id');
			$('.order-delivery-zone__selectBox').addClass('is-hide').removeClass('is-show')
			$('.order-delivery-zone__selectBox[data-id="'+selectedDelId+'"]').addClass('is-show').removeClass('is-hide')
			$('.order-delivery-zone__selectBox option').attr('selected',false)
			$('.order-delivery-zone__selectBox[data-id="'+selectedDelId+'"] option:first-of-type').attr('selected',true);
			$('.order-delivery__radio[value="'+selectedDelId+'"]').click();
			var WithoutZone = $('.order-delivery__item[data-id='+ selectedDelId +'] .order-delivery__radio:checked').attr('pricewithoutzones');
			var WithZone = $('.order-delivery__item[data-id='+ selectedDelId +'] .order-delivery-zone__radio:checked').attr('price');
			if(WithZone >= 0){
				startprice = WithZone;
			}else{
				startprice = WithoutZone;
			}
			$('.order-delivery__changeprice').text(addSpaces(startprice));
			$('.cartSumDelivery .num').text(addSpaces(startprice));

			$('.order-payment').addClass('is-hide').removeClass('is-show')
			$('.order-payment[rel="'+ selectedDelId +'"]').addClass('is-show').removeClass('is-hide')
			var startInputId = $('.order-delivery__radio:checked').attr('value');
			$('.order-payments_items .order-payment input').attr('checked',false);
			$('.order-payments_items .order-payment[rel="'+startInputId+'"] input').each(function(){
				$(this).click();
				return false;
			});

			$('.order-payment__select option:first-child').prop('selected', true);

			// Вывод описания доставки
			var delDesc = $('.order-delivery__desc');
			var deliveryDescription = $('.order-delivery__radio:checked').parent().find('.order-delivery__desc').html()
			delDesc.html(deliveryDescription);
			if (deliveryDescription == undefined ) {
				delDesc.addClass('is-hide').removeClass('is-show')
			}else{
				delDesc.addClass('is-show').removeClass('is-hide')
			}

			// Вывод описания оплаты
			var paymentDescription = $('.order-payments_items .order-payment__radio:checked').parent().find('.order-delivery__desc').html()
			var payDesc = $('.order-payment__desc');
			payDesc.html(paymentDescription);
			if (paymentDescription == undefined ) {
				payDesc.addClass('is-hide').removeClass('is-show')
			}else{
				payDesc.addClass('is-show').removeClass('is-hide')
			}

		});

		// Выбор зоны доставки
		$('.order-delivery-zone__select').on('change', function(){
			var optValue = $(this).find('option:selected').attr('value');
			$('.order-delivery-zone__radio[value="'+optValue+'"]').click();
			var WithZone = $('.order-delivery-zone__radio:checked').attr('price');
			$('.order-delivery__changeprice').text(addSpaces(WithZone));
			$('.cartSumDelivery .num').text(addSpaces(WithZone));
		});

		// Выбор оплаты
		$('.order-payment__select').on('change', function(){
			var selectedDelId = $(this).find('option:selected').attr('value');
			$('.order-payments_items .order-payment__radio[value="'+selectedDelId+'"]').click();
			var paymentDescription = $('.order-payments_items .order-payment__radio:checked').parent().find('.order-payment__desc').html();
			var payDesc = $('.order-payment__desc');
			payDesc.html(paymentDescription);
			if (paymentDescription == undefined ) {
				payDesc.addClass('is-hide').removeClass('is-show')
			}else{
				payDesc.addClass('is-show').removeClass('is-hide')
			}
		});

	}
	
	// Отправка купона при оформлении заказа
	this.coupons = function(){
		var couponButton = $('.coupon__button');
		var couponInput = $('.coupon__code');
		var couponParent = couponInput.parent();
		var resetBtn = $('.coupon__reset');
		var totalCouponBlock = $('.cartTotal__item-coupons');
		var totalDiscountBlock = $('.cartTotal__item-discount');
	
		// Отправка формы
		couponButton.off('click').on('click', function(){
			var url = '/order/stage/confirm';
			var val = couponInput.val();
			var oldVal = couponInput.attr('data-value');
			couponInput.attr('data-value', val);
	
			// Если ничего не ввели
			if(val == ''){
				couponInput.addClass('error')
				return false;
			}
	
			// Если купон не изменился
			if(val == oldVal){
				couponInput.removeClass('focus');
				notyStart('Вы уже вводили данный купон', 'warning')
				return false;
			}
	
	
			// Получаем данные формы, которые будем отправлять на сервер
			var formData = $('#order_form').serializeArray();
			formData.push({name: 'ajax_q', value: 1});
			formData.push({name: 'only_body', value: 1});
			formData.push({name: 'form[coupon_code]', value: val});
	
			$.ajax({
				type: "POST",
				cache: false,
				url: url,
				data: formData,
				success: function(data) {
					// Получаем блок скидки
					var discountBlock = $(data).closest('#order_form').find('.order-discount');
					var discountName = discountBlock.find('.order-discount__name').text();
					var discountPrice = discountBlock.find('.order-discount__value').html();
					var discountPercent = discountBlock.find('.order-discount__percent').html();
					
					// Определяем наличие скидки в % или валюте
					if (discountPrice) {
						discountPrice = discountPrice
					}else if (discountPercent){
						discountPrice = discountPercent
					}else {
						totalCouponBlock.hide();
					}
	
					// Получаем новую итоговую стоимость заказа
					var totalBlock = $(data).closest('#order_form').find('.order-total');
					var totalSum = totalBlock.find('.cartSumDiscount').attr('data-price');
					var deliveryPrice = totalBlock.find('.cartSumDelivery').attr('data-price');
					var newTotalSum = parseInt(totalSum) + parseInt(deliveryPrice);
	
					// Записываем название и размер скидки по купону
					totalCouponBlock.find('.cartTotal__label span').html(discountName);
					totalCouponBlock.find('.cartSumCoupons').html(discountPrice);
					totalCouponBlock.show();
					totalDiscountBlock.hide();
	
					// Проверяем купон
					var cartSumTotal = $('.orderSumDefaul:eq(0)').attr('value')
					if (newTotalSum > cartSumTotal) {
						couponInput.val("").attr("placeholder", "Купон неверен").removeClass('focus');
						couponParent.removeClass('success').addClass('error');
						totalCouponBlock.hide();
						totalDiscountBlock.show();
						$('.cartSumTotal .num').text(addSpaces(newTotalSum));
						notyStart('Купон не применен', 'warning')
					} else if (newTotalSum == cartSumTotal) {
						if (discountName) {
							couponInput.addClass('focus');
							couponParent.addClass('success');
							totalCouponBlock.show();
							notyStart('Скидка уже используется', 'warning')
						}else{
							couponInput.val("").addClass('error');
							couponParent.addClass('error');
							totalCouponBlock.hide();
							notyStart('Купон не применен', 'warning')
						}
					} else {
						couponInput.removeClass('error').addClass('focus');
						couponParent.removeClass('error').addClass('success');
						totalCouponBlock.show();
						// Обновляем значение итоговой стоимости
						$('.cartSumTotal').attr('data-price', newTotalSum);
						$('.cartSumTotal .num').text(addSpaces(newTotalSum));
						$('.cartSumCoupons').attr('data-value', newTotalSum);
						$('.cartSumDiscount').attr('data-value', totalSum);
						$('.cartSumDiscount .num').text(addSpaces(totalSum));
						notyStart('Купон успешно применен!', 'success')
					}
				},
				error: function(data){
					console.log("Возникла ошибка: Невозможно отправить форму купона.");
				}
			});
		});
	
		// Сброс
		resetBtn.on('click', function(){
			couponInput.val('').trigger('input');
			setTimeout(function(){
				totalCouponBlock.hide();
				totalDiscountBlock.show();
				var cartSum = $('.cartSumDiscount').data('value');
				var deliveryPrice = parseInt($('.cartSumDelivery:eq(0) .num').text() || 0);
				var newTotalSum = cartSum + deliveryPrice;
				// Возвращаем значение по умолчанию итоговой стоимости
				$('.cartSumTotal .num').text(addSpaces(newTotalSum));
				$('.cartSumTotal').attr('data-price', newTotalSum);
				$('.cartSumCoupons').attr('data-value', newTotalSum);
				$('.cartSumDiscount').attr('data-value', newTotalSum);
				$('.cartSumDiscount .num').text(addSpaces(newTotalSum));
				
				couponInput.val("").attr("placeholder", "Введите купон").removeClass('focus').removeClass('error');
				couponInput.attr('data-value', '')
				couponParent.removeClass('error').removeClass('success');
			}, 500);
		});
	
		// Отображение кнопки Сброс
		couponInput.on('input',function(){
			if($(this).val()) {
				resetBtn.addClass('focus')
			} else {
				resetBtn.removeClass('focus')
			}
		});
	
	}

	// Оформление заказа в выпадающей корзине
	this.orderCart = function(){
		var urlQuickForm = '/cart/add'; // адрес страницы с формой
		// данные которые отарвятся на сервер чтобы получить только форму быстрого заказа без нижней части и верхней части сайта
		var quickFormData = [
			{name: 'ajax_q', value: 1},
			{name: 'fast_order', value: 1}
		];
		$.ajax({
			type: "POST",
			cache: false,
			url: urlQuickForm,
			data: quickFormData,
			success: function(data) {
				$.fancybox.open(data, {
					keyboard: false,
					baseClass: "fastOrder",
					afterShow: function(){
						preload();
						password.onPass();
						password.onReg();
						password.capsWarning();
						order.onInit();
						order.onSelect();
						order.coupons();
						order.onValidate();
						// Стили для новых селектов
						$('.form__phone').mask('+7 (999) 999-9999');
					}
				})
			}
		});
	}

}


// Объявляем конструктор функции пароля
var password = new Password();
// Объявляем конструктор Сравнения
var compare = new Compare();
// Объявляем конструктор Товара
var product = new Product();
// Объявляем конструктор Удаления
var remove = new Remove();
// Объявляем конструктор Товары
var catalog = new Catalog();
// Объявляем конструктор Товар
var goods = new Goods();
// Объявляем конструктор Корзины
var cart = new Cart();
// Объявляем конструктор Заказа
var order = new Order();
// Объявляем конструктор Количества
var quantity = new Quantity();
// Объявляем конструктор Счетчиков Товара
var quantityGoods = new QuantityGoods();
// Объявляем конструктор Счетчиков Выпадающей корзины
var quantityAddto = new QuantityAddto();
// Объявляем конструктор Счетчиков Корзины
var quantityCart = new QuantityCart();
// Объявляем конструктор Счетчиков 
var quantityProduct = new QuantityProduct();


///////////////////////////////////////
// Дополнительные пункты меню в шапке Перенос пунктов меню
///////////////////////////////////////
function mainnav(id,rows,media){
	if(getClientWidth() > media){
		var mainNav = $(id);
		var overMenuExist = mainNav.find('.mainnav__overflow li').length;
		var mainNavList = mainNav.find('.mainnav__list');
		var mainNavOverflow = mainNav.find('.mainnav__overflow');
		var mainNavMore = $('.mainnav__more');

		// Восстановление классов для больших экранов
		mainNavOverflow.addClass('dropdown__content');
		mainNavMore.addClass('mainnav__more_hidden')

		if(overMenuExist){
			mainNavOverflow.find('li').removeClass('mainnav__replaced');
			mainNavMore.remove();
			mainNavOverflow.find('li').each(function(){
				mainNavList.append($(this));
			});
		}

		var menuHeight = rows;
		var menuWidth = mainNav.width() * menuHeight;
		var menuCount = mainNavList.find('li').length + 1;
		var nextCheck = 0;

		for(var i=1; i < menuCount;  i++){
			var currentWidth = parseInt(Math.ceil(mainNavList.find('li:nth-child('+i+')').width())) + 8;
			nextCheck += currentWidth;

			if(nextCheck > menuWidth){
				var a = i;
				for(a;a < menuCount;a++){
					mainNavList.find('li:nth-child('+ a +')').addClass('mainnav__replaced');
				}

				mainNav.find('.mainnav__replaced').each(function(){
					mainNavOverflow.append($(this));
				});

				mainNavList.append('<li class="mainnav__more"><a class="mainnav__link flex"><span>Ещё</span><i class="icon-chevron_down"></i></a></li>');

				mainNav.find('.mainnav__more').on('click',function(){
					if($(this).hasClass('is-opened')){
						$(this).removeClass('is-opened');
						mainNav.removeClass('is-opened');
						mainNavOverflow.removeClass('is-opened');
						$('#overlay').removeClass('is-opened');
					} else{
						$(this).addClass('is-opened');
						mainNav.addClass('is-opened');
						mainNavOverflow.addClass('is-opened');
						$('#overlay').addClass('is-opened')
					}
				});

				return false;
			}
		}
	}else{
		// Удаление классов для маленьких экранов
		$('.mainnav__overflow').removeClass('dropdown__content');
		$('.mainnav__more').removeClass('mainnav__more_hidden');
	}
}


///////////////////////////////////////
// Функция показать все на главной
///////////////////////////////////////
function pdtVisible(id){
	var item = $(id).find('.product__item');
	var visible = $(id).find('.product__item:visible').length;

	// Кнопка показать все
	var button = $(id).find('.pdt__visible-button');
	
	// Скрываем кнопку показать все если мало товаров
	item.length > visible ? button.parent().show() : button.parent().hide()

	// Функция открытия скрытых товаров
	button.on('click', function (event){
		event.preventDefault();
		changeTxt($(this).find('span'))
		if($(this).hasClass('is-actived')){
			$(this).removeClass('is-actived')
			item.removeClass('is-show')
			$('html, body').animate({scrollTop : $(id).offset().top}, 600);
		}else{
			$(this).addClass('is-actived')
			item.addClass('is-show')
			var scrollTop = $(id).offset().top + $(id).height() - $(window).height();
			$('html, body').animate({scrollTop : scrollTop}, 600);
		}
	});
}


///////////////////////////////////////
// Новости
///////////////////////////////////////
function indexNews() {
	var news = '#news'
	// Свайпер слайдер новостей
	function swiperNews(id) {
		var nav = id + ' .swiper-navigation'

		// Слайдер товаров
		var swiper = new Swiper(id + ' .swiper', {
			loop: false,
			autoplay: true,
			watchSlidesVisibility: true,
			simulateTouch: true,
			grabCursor: true,
			slidesPerView: '3',
			spaceBetween: 16,
			nested: true,
			preloadImages: false,
			autoHeight: false,
			lazy: {
				enabled: false,
				loadPrevNext: true,
				loadOnTransitionStart: true,
			},
			navigation: {
				nextEl: news + ' .swiper-button-next',
				prevEl: news + ' .swiper-button-prev',
			},
			breakpoints: {
				0: {
					slidesPerView: '1',
				},
				320: {
					slidesPerView: '1',
				},
				480: {
					slidesPerView: '2',
				},
				640: {
					slidesPerView: '2',
				},
				768: {
					slidesPerView: '3',
				},
				1024: {
					slidesPerView: '3',
				},
				1200: {
					slidesPerView: '3',
				}
			}
		});

		// Скрываем навигацию если слайдер заблокирован
		if($(news).find('.swiper-button-disabled').length == 2){
			$(news).find('.swiper-navigation').addClass('swiper-navigation-lock')
		}else{
			$(news).find('.swiper-navigation').removeClass('swiper-navigation-lock')
		}
	}

	// Запуск функций новостей
	function initNews(){
		$(news).find('.tabs__content').each(function(){
			var attr = $(this).attr('id');
			swiperNews('#' + attr)
			// Скрываем навигацию родителя если слайдер заблокирован
			$('#' + attr).find('.swiper-navigation').parent().addClass('swiper-navigation-lock')
		});
	}
	initNews()

	// Табы в товарах на главной
	// TODO добавить хеш в табе новостей
	$(news).find('.news__nav').on('click', function(event) {
		event.preventDefault();
		var tab = $(this).attr('data-tab');
		$(news).find('.tabs__content').prepend('<div class="preloader"><div class="loading"></div></div>');
		preload();
		$(news).find('.preloader').remove();
		$(news).find('.news__nav').removeClass('is-actived')
		$(news).find('.tabs__content').removeClass('is-show');
		$(this).addClass('is-actived');
    $('#'+ tab).addClass('is-show');
		initNews()
	});

}

///////////////////////////////////////
// Отсчет даты до окончания акции
///////////////////////////////////////
function counterDate() {
	var id = $('.counter');
	// Если не найдет счетчик прекращаем работу функции
	if(!id.length){
		return false;
	}
	// Перебираем каждый счетчик
	id.each(function(){
		var t = $(this);
		// Устанавливаем дату обратного отсчета ММ-ДД-ГГ
		var expired = t.attr('data-expired');
		var countDownDate = new Date(expired).getTime();
		// Обновление счетчика каждую секунду
		var x = setInterval(function(){
			var now = new Date().getTime();
			var distance = countDownDate - now;
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			// Вывод
			t.find('.days span').text(days);
			t.find('.hours span').text(hours);
			t.find('.minutes span').text(minutes);
			t.find('.seconds span').text(seconds);
			// Счетчик завершен
			if (distance < 0) {
				clearInterval(x);
				t.hide();
			}else{
				t.css({'display':'flex'});
				t.prev().hide();
			}
		}, 1000);
	})
}


///////////////////////////////////////
// Открытие Контактов, Меню, Сравнения, Избранного
///////////////////////////////////////
function openMenu() {
	// Открытие каталога с сохранением вложенности
  $('.catalog__open').on('click', function(event){
    event.preventDefault();
    var parent = $(this).closest('.parent');
    var sub = $(this).parent().next('.catalog__sub');
    var open = $(this).closest('.catalog__open');
    if (parent.hasClass('is-opened')) {
      sub.slideUp(600);
      parent.removeClass('is-opened');
      open.removeClass('is-opened');
    } else {
      sub.slideDown(600);
      parent.addClass('is-opened');
      open.addClass('is-opened');
    }
  });

	// Закрытие всего при нажатии на темную часть
	$('#overlay').on('click', function(event){
		event.preventDefault();
		if($(this).hasClass('is-opened')){
			closeAll();
		}
	});
	
	// Открытие подвала
	$('.footer__title').on('click', function(event){
    event.preventDefault();
		if (getClientWidth() < 640){
			$(this).toggleClass('is-actived')
			$(this).next().slideToggle();
		}else{
			$(this).next().attr('style', '')
		}
	});

	// Открытие элементов
  $('[data-open]').on('click', function(event){
    event.preventDefault();
    var value = $(this).data('open');
		$('[data-open]').removeClass('is-opened')
		$('[data-opened]').removeClass('is-opened')
    if ($('[data-opened="'+ value +'"]').hasClass('is-opened')){
      $('#overlay').removeClass('is-opened');
      $('[data-opened="'+ value +'"]').removeClass('is-opened');
      $(this).removeClass('is-opened').parent().removeClass('is-opened');
    }else{
      $('#overlay').addClass('is-opened');
      $('[data-opened="'+ value +'"]').addClass('is-opened');
      $(this).addClass('is-opened').parent().addClass('is-opened');
    }
		// Поиск
		if (value == 'search'){
			$('#overlay').removeClass('is-opened');
		}

  });

	// Открытие элементов
  $('[data-toggle]').on('click', function(event){
    event.preventDefault();
    if ($(this).hasClass('is-actived')){
      $(this).removeClass('is-actived').parent().removeClass('is-opened');
			$(this).next().slideUp().removeClass('is-opened');
    }else{
			$('[data-toggle]').removeClass('is-actived').parent().removeClass('is-opened');
			$('[data-toggled]').slideUp().removeClass('is-opened');
      $(this).addClass('is-actived').parent().addClass('is-opened');
			$(this).next().slideDown().addClass('is-opened');
    }
  });

	// Открыть поиск
	$('.adaptive-search__icon, .search__icon').on('click',function(event){
		event.preventDefault();
		$('.search, .adaptive-search__content').addClass('is-opened');
		$('#overlay').addClass('is-opened');
		$('.search__input').focus();
	})

	// Каталог на мобильных устройствах
	$('.header-catalog__icon, .adaprive__navigate-catalog').on('click',function(event){
		event.preventDefault();

		if(getClientWidth() > 1023) {
			window.location = this.href;
			return false
		}

		$('.adaptive__sideblock-menu').removeClass('is-opened');
		$('.adaptive__sideblock-catalog').toggleClass('is-opened');
		$('.adaptive__sideblock-catalog').hasClass('is-opened') ? $('#overlay').addClass('is-opened transparent'): $('#overlay').removeClass('is-opened transparent')
	})

	// Открыть Меню
	$('.adaptive-menu__icon, .adaprive__navigate-user').on('click',function(event){
		event.preventDefault();
		$('.adaptive__sideblock-catalog').removeClass('is-opened');
		$('.adaptive__sideblock-menu').toggleClass('is-opened');
		$('.adaptive__sideblock-menu').hasClass('is-opened') ? $('#overlay').addClass('is-opened transparent'): $('#overlay').removeClass('is-opened transparent')
	})

	// Закрыть
	$('.adaptive__sideblock-title').on('click',function(event){
		closeAll();
	})
}

// Функция удаления классов всех активных элементов
function closeAll() {
	$('div, a, form, span, nav, ul, li').removeClass('is-opened');
	$('.overflowMenu').removeClass('is-actived');
	// $('.search__reset').click();
	$('#overlay').click();
	setTimeout(function(){
		$('#overlay').removeClass('transparent');
		// $('.search__reset').click();
		// $('.search__input').blur(); 
		$('#overlay').click();
	},100)
}


// Функция вычисления скидки в корзине
function cartSaleSum(){
	var arr = []

	// Находим разницу в цене
	$('.addto__cart .addto__item').each(function(){
		var priceNow = $(this).find('.price__now').data('price')
		var priceOld = $(this).find('.price__old').data('price')
		if(typeof(priceOld) !== 'undefined'){
			if(priceOld > priceNow){
				var diff = priceOld - priceNow;
				// Добавляем разницу в массив
				arr.push(diff);
			}
		} else {
			
		}
	});

	// Итоговая сумма скидки
	var sum = 0;
	for (var i=0; i<arr.length; i++){
		sum += arr[i]
	}

	// Обновляем сумму скидки
	$('.addto__cart .cartSumOld').find('.num').text(addSpaces(sum)).parent().show();
}


///////////////////////////////////////
/* Аякс Отправка формы без обновления страницы */
///////////////////////////////////////
function ajaxForms(id,flag,successMessage,errorMessage){
  var flag = false;
  var form = $(id).find('.form__callback');
  form.on('submit',function(event){
    event.preventDefault();
    if(!flag){
      t = $(this);
      var url = t.prop('action');
      var formData = t.serializeArray();
      formData.push({name: 'ajax_q', value: 1});
      formData.push({name: 'only_body', value: 1});
      $.ajax({
        method: 'POST',
        cache: false,
        url: url,
        data: formData,
        success: function(d){
          var serverCall = JSON.parse(d).status;
          if(serverCall == "ok"){
						setTimeout(function () {
							$.fancybox.close();
						},2000);
						// Функция, которая отображает сообщения пользователю
						var content = '<div class="noty__addto"><div class="noty__message">' + successMessage + '</div></div>';
						notyStart(content, 'success');
            flag = true;
          }
        },
				error: function(d){
					callbackError()
				}
      });
    }else{
			callbackError()
    }
  });
	
	function callbackError() {
		$(id).addClass('error')
		// Функция, которая отображает сообщения пользователю
		var content = '<div class="noty__addto"><div class="noty__message">' + errorMessage + '</div></div>';
		notyStart(content, 'warning');
	}
}

// "Обратный звонок" в модальном окне.
ajaxForms('#fancybox__callback','fancyCallbackFlag','Запрос обратного звонка успешно отправлен администрации магазина','Вы уже отправляли запрос. Пожалуйста ожидайте звонка.')
// "Обратная связь" в модальном окне.
ajaxForms('#fancybox__feedback','fancyFeedbackFlag','Запрос обратной связи успешно отправлен администрации магазина','Вы уже отправляли запрос. Пожалуйста ожидайте.')
// "Уведомить" в модальном окне.
ajaxForms('#fancybox__notify','notifyFlag','Вы будете уведомлены о поступлении товара','Вы уже отправляли запрос. Пожалуйста ожидайте.')
// "Обратная связь".
ajaxForms('.form__feedback','feedbackFlag','Спасибо за обращение! Мы свяжемся с вами в ближайшее время','Вы уже отправляли запрос. Пожалуйста ожидайте.')
// Страница "Обратный звонок".
ajaxForms('.page-сallback','pageCallbackFlag','Спасибо за обращение! Мы перезвоним вам в ближайшее время','Вы уже отправляли запрос. Пожалуйста ожидайте звонка.')
// "Обратный звонок".
// ajaxForms('#callback','callbackFlag','Спасибо за обращение! Мы перезвоним вам в ближайшее время','Вы уже отправляли запрос. Пожалуйста ожидайте звонка.')
// "Подписаться".
ajaxForms('#subscribe','subscribeFlag','Спасибо за обращение! Вы подписались на наши уведомления','Вы уже отправляли запрос. Пожалуйста ожидайте.')


// Функции стандартного слайдера
function swiperSlider(id){
	// Слайдер товаров
	var swiper = new Swiper(id + ' .swiper', {
		loop: false,
		autoplay: false,
		watchSlidesVisibility: true,
		simulateTouch: true,
		grabCursor: true,
		slidesPerView: '4',
		spaceBetween: 24,
		nested: true,
		preloadImages: false,
		lazy: {
			enabled: true,
			loadPrevNext: true,
			loadOnTransitionStart: true,
		},
		navigation: {
			nextEl: id + ' .swiper-button-next',
			prevEl: id + ' .swiper-button-prev',
		},
		pagination: {
			el: id + ' .swiper-pagination',
			type: 'bullets',
			dynamicBullets: false,
			clickable: true,
		},
		breakpoints: {
			0: {
				slidesPerView: '1',
			},
			320: {
				slidesPerView: '1',
			},
			480: {
				slidesPerView: '2',
			},
			640: {
				slidesPerView: '2',
			},
			768: {
				slidesPerView: '3',
			},
			1024: {
				slidesPerView: '4',
			},
			1200: {
				slidesPerView: '4',
			}
		},
	});

	// Скрываем навигацию если слайдер заблокирован
	if($(id).find('.swiper-button-lock').length){
		$(id).find('.swiper-button-lock').parent().addClass('swiper-navigation-lock')
	}else{
		$(id).find('.swiper-navigation').removeClass('swiper-navigation-lock')
	}

}

// Слайдер на главной
function swiperShow(){
	var id = '.slideshow'

	var swiper = new Swiper(id + ' .swiper', {
		loop: false,
		preloadImages: false,
		watchSlidesVisibility: true,
		watchOverflow: true,
		hashNavigation: false,
		slidesPerView: '1',
		spaceBetween: 16,
		speed: 400,
		lazy: {
			enabled: true,
			loadPrevNext: true,
			loadOnTransitionStart: true,
		},
		pagination: {
			el: id + ' .swiper-pagination',
			type: 'bullets',
			dynamicBullets: false,
			clickable: true,
		},
		navigation: {
			nextEl: id + ' .swiper-button-next',
			prevEl: id + ' .swiper-button-prev',
		},
		breakpoints: {
			0: {
				slidesPerView: '1',
			},
			320: {
				slidesPerView: '1',
			},
			480: {
				slidesPerView: '1',
			},
			640: {
				slidesPerView: '1.2',
			},
			768: {
				slidesPerView: '1.4',
			},
			1024: {
				slidesPerView: '1.6',
			},
			1200: {
				slidesPerView: '1',
			}
		},
	});

	// Скрываем навигацию если слайдер заблокирован
	if($(id).find('.swiper-button-lock').length){
		$(id).find('.swiper-button-lock').parent().addClass('swiper-navigation-lock')
	}else{
		$(id).find('.swiper-navigation').removeClass('swiper-navigation-lock')
	}
}

// Слайдер Каталога
function swiperCatalog(){
	var id = '#catalog'
	// Слайдер товаров
	var swiper = new Swiper(id + ' .swiper', {
		loop: false,
		autoplay: false,
		watchSlidesVisibility: true,
		simulateTouch: true,
		grabCursor: true,
		slidesPerView: '5',
		spaceBetween: 16,
		nested: true,
		preloadImages: false,
		lazy: {
			enabled: true,
			loadPrevNext: true,
			loadOnTransitionStart: true,
		},
		navigation: {
			nextEl: id + ' .swiper-button-next',
			prevEl: id + ' .swiper-button-prev',
		},
		breakpoints: {
			0: {
				slidesPerView: '1',
			},
			320: {
				slidesPerView: '2',
			},
			480: {
				slidesPerView: '3',
			},
			640: {
				slidesPerView: '2',
			},
			768: {
				slidesPerView: '3',
			},
			1024: {
				slidesPerView: '4',
			},
			1200: {
				slidesPerView: '5',
			}
		},
	});

	// Скрываем навигацию если слайдер заблокирован
	if($(id).find('.swiper-button-lock').length){
		$(id).find('.swiper-button-lock').parent().addClass('swiper-navigation-lock')
	}else{
		$(id).find('.swiper-navigation').removeClass('swiper-navigation-lock')
	}

}

// Слайдер Предложений
function swiperOffers(){
	var id = '#offers'
	// Слайдер товаров
	var swiper = new Swiper(id + ' .swiper', {
		loop: false,
		autoplay: false,
		watchSlidesVisibility: true,
		simulateTouch: true,
		grabCursor: true,
		slidesPerView: '2',
		spaceBetween: 16,
		nested: true,
		preloadImages: false,
		lazy: {
			enabled: false,
			loadPrevNext: true,
			loadOnTransitionStart: true,
		},
		navigation: {
			nextEl: id + ' .swiper-button-next',
			prevEl: id + ' .swiper-button-prev',
		},
		breakpoints: {
			0: {
				slidesPerView: '1',
			},
			320: {
				slidesPerView: '1',
			},
			480: {
				slidesPerView: '2',
			},
			640: {
				slidesPerView: '1',
			},
			768: {
				slidesPerView: '1',
			},
			1024: {
				slidesPerView: '2',
			},
			1200: {
				slidesPerView: '2',
			}
		},
	});

	// Скрываем навигацию если слайдер заблокирован
	if($(id).find('.swiper-button-lock').length){
		$(id).find('.swiper-button-lock').parent().addClass('swiper-navigation-lock')
	}else{
		$(id).find('.swiper-navigation').removeClass('swiper-navigation-lock')
	}

}

// Слайдер Вы смотрели
function swiperViewed(){
	var id = '#pdt__viewed'
	// Слайдер товаров
	var swiper = new Swiper(id + ' .swiper', {
		loop: false,
		autoplay: false,
		watchSlidesVisibility: true,
		simulateTouch: true,
		grabCursor: true,
		slidesPerView: '5',
		spaceBetween: 16,
		nested: true,
		preloadImages: false,
		lazy: {
			enabled: true,
			loadPrevNext: true,
			loadOnTransitionStart: true,
		},
		navigation: {
			nextEl: id + ' .swiper-button-next',
			prevEl: id + ' .swiper-button-prev',
		},
		breakpoints: {
			0: {
				slidesPerView: '1',
			},
			320: {
				slidesPerView: '2',
				spaceBetween: 8,
			},
			480: {
				slidesPerView: '3',
			},
			640: {
				slidesPerView: '2',
			},
			768: {
				slidesPerView: '3',
			},
			1024: {
				slidesPerView: '4',
			},
			1200: {
				slidesPerView: '5',
			}
		},
	});

	// Скрываем навигацию если слайдер заблокирован
	if($(id).find('.swiper-button-lock').length){
		$(id).find('.swiper-button-lock').parent().addClass('swiper-navigation-lock')
	}else{
		$(id).find('.swiper-navigation').removeClass('swiper-navigation-lock')
	}

}

// Слайдер на главной
function swiperSales(){
	var id = '#pdt__sales'

	var swiper = new Swiper(id + ' .swiper', {
		loop: false,
		preloadImages: false,
		watchSlidesVisibility: true,
		watchOverflow: true,
		hashNavigation: false,
		slidesPerView: '1',
		spaceBetween: 48,
		speed: 400,
		lazy: {
			enabled: true,
			loadPrevNext: true,
			loadOnTransitionStart: true,
		},
		navigation: {
			nextEl: id + ' .swiper-button-next',
			prevEl: id + ' .swiper-button-prev',
		},
		breakpoints: {
			0: {
				slidesPerView: '1',
			},
			320: {
				slidesPerView: '1',
			},
			480: {
				slidesPerView: '1',
			},
			640: {
				slidesPerView: '1',
			},
			768: {
				slidesPerView: '1',
			},
			1024: {
				slidesPerView: '2',
			},
			1200: {
				slidesPerView: '1',
			}
		},
	});

	// Скрываем навигацию если слайдер заблокирован
	if($(id).find('.swiper-button-lock').length){
		$(id).find('.swiper-button-lock').parent().addClass('swiper-navigation-lock')
	}else{
		$(id).find('.swiper-navigation').removeClass('swiper-navigation-lock')
	}
}


// Переименование названий Месяца
// function monthNames() {
// 	if ($('.month').length){
// 		$('.month').each(function(){
// 			if ($(this).text() === 'Jan') {
// 				$(this).text('Января')
// 			}else if ($(this).text() === 'Feb') {
// 				$(this).text('Февраля')
// 			}else if ($(this).text() === 'Mar') {
// 				$(this).text('Марта')
// 			}else if ($(this).text() === 'Apr') {
// 				$(this).text('Апреля')
// 			}else if ($(this).text() === 'May') {
// 				$(this).text('Мая')
// 			}else if ($(this).text() === 'Jun') {
// 				$(this).text('Июня')
// 			}else if ($(this).text() === 'Jul') {
// 				$(this).text('Июля')
// 			}else if ($(this).text() === 'Aug') {
// 				$(this).text('Августа')
// 			}else if ($(this).text() === 'Sep') {
// 				$(this).text('Сентября')
// 			}else if ($(this).text() === 'Oct') {
// 				$(this).text('Октября')
// 			}else if ($(this).text() === 'Nov') {
// 				$(this).text('Ноября')
// 			}else if ($(this).text() === 'Dec') {
// 				$(this).text('Декабря')
// 			}
// 		});
// 	}
// }


///////////////////////////////////////
// Загрузка основных функций шаблона
///////////////////////////////////////
$(document).ready(function(){
	userAgent();
	openMenu();
	toTop();
	// cartSaleSum();
	swiperViewed();
  mainnav('header .mainnav', '1', 991);
	fixedMenu()
	quantityAddto.onAddto()
	catalogItems.hover()

	// Удаление классов загрузки для элементов страницы
	$('.loading').addClass('loaded');
	$('div, section, ul, a, body').removeClass('loading');

	// Отправка формы по Ctrl+Enter
  $('form').bind('keypress', function(e){
    if((e.ctrlKey) && ((e.which==10)||(e.which==13))) {$(this).submit();}
    // Отправка данных формы по нажатию на Enter в случае если курсор находится в input полях (В некоторых браузерах при нажатии по enter срабатывает клик по первому submit полю, которое является кнопкой назад. Для этого написан этот фикс)
  }).find('input').bind('keypress', function(e){
    if(((e.which==10)||(e.which==13))) { try{$(this.form).submit();} catch(e){} return false; }
  });

	// Ленивая загрузка
  $(function(){
    var observer = lozad(); // lazy loads elements with default selector as '.lozad'
    observer.observe();
  });

  // Маска ввода телефона
  $('.form__phone').mask('+7 (999) 999-9999');

  // Возврашаем пользователя на страницу с которой был сделан обратный звонок
  $('.callbackredirect').val(document.location.href);

});

function fixedMenu() {
	var header = document.querySelector('.header__middle')
  window.addEventListener('scroll', function() {
		window.pageYOffset > 199 ? header.classList.add('is-fixed') : header.classList.remove('is-fixed')
  });

}


// Запуск функций при изменении экрана
$(window).resize(function(){
  if(getClientWidth() > 481 && window.outerHeight < 630){
    $('body').addClass('landscape');
  }else{
    $('body').removeClass('landscape');
  }
  mainnav('header .mainnav', '1', 991);
});


function CatalogItems(){
	this.hover = function(){
		const items = document.querySelectorAll('.catalog__items-main .catalog__item')
		
		items.forEach((element) => {
			element.addEventListener('mouseenter', () => {
				catalogItems.onHover(element)
			})
		})

		// subItems.forEach((element) => {
		// 	element.classList.remove('is-show')
		// })

	}

	this.onHover = function(element){
		const id = element.getAttribute('data-id')
		const parent = element.classList.contains('parent')
		const subItems = document.querySelectorAll('.catalog__items-sub .catalog__item')
		if (parent) {
			subItems.forEach((element) => element.classList.remove('is-show'))
			$('.catalog__item[data-id="'+ id +'"]').addClass('is-show')
		} else {
			const subItems = document.querySelectorAll('.catalog__items-sub .catalog__item')
			subItems.forEach((element) => element.classList.remove('is-show'))
			return false
		}
	}

}

// Объявляем конструктор Количества
var catalogItems = new CatalogItems();
