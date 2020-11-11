$.fn.Tabs = function() {
	var selector = this;

	this.each(function() {
		var obj = $(this); 
		$(obj.attr('href')).hide();
		$(obj).click(function() {
			$(selector).removeClass('selected');
			
			$(selector).each(function(i, element) {
				$($(element).attr('href')).hide();
			});
			
			$(this).addClass('selected');
			$($(this).attr('href')).fadeIn();
			return false;
		});
	});

	$(this).show();
	$(this).first().click();
	if(location.hash!='' && $('a[href="' + location.hash + '"]').length)
		$('a[href="' + location.hash + '"]').click();	
};


 jQuery.validator.setDefaults({
  errorClass: 'invalid',
	successClass: 'valid',
	focusInvalid: false,
	errorElement: 'span',
	errorPlacement: function (error, element) {
    error.insertAfter(element);
  },
  highlight: function(element, errorClass, validClass) {
		$(element).addClass(errorClass).removeClass(validClass);
		$(element).prev('label').addClass(errorClass);
  },
  unhighlight: function(element, errorClass, validClass) {
		$(element).removeClass(errorClass).addClass(validClass);
		$(element).prev('label').removeClass(errorClass);
  }
});
//дефолтные сообщения, предупреждения
jQuery.extend(jQuery.validator.messages, {
  // required: "Обязательное поле",
  // email: "Некорректный email адрес",
  // url: "Некорректный URL",
  // number: "Некорректный номер",
  // digits: "Это поле поддерживает только числа",
  // equalTo: "Поля не совпадают",
  // maxlength: jQuery.validator.format('Максимальная длина поля {0} символа(ов)'),
  // minlength: jQuery.validator.format('Минимальная длина поля {0} символа(ов)'),
  // require_from_group: jQuery.validator.format('Отметьте миниммум {0} из этих полей')
});
//кастомные методы валидатора
jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-zA-ZА-Яа-я\s]+$/i.test(value);
}, "Только буквы");

jQuery.validator.addMethod("telephone", function(value, element) {
  return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){6,14}(\s*)?$/i.test(value);
}, "Некорректный формат"); 


//функция для навешивания изображений фоном
function backgrounded (selector) {
	$(selector).each(function(){
		var $this = $(this),
		$src = $this.find('.ui-backgrounded-bg').attr('src');
		if($this.find('.ui-backgrounded-bg').length) {
			$this.addClass('backgrounded').css('backgroundImage','url('+$src+')');
		}
	});
}


//lazy load для сторонних либ
function lazyLibraryLoad(scriptSrc,linkHref,callback) {
  let script = document.createElement('script');
  script.src = scriptSrc;
  document.querySelector('script[src*="script.js"]').before(script);

  if (linkHref !== '') {
    let style = document.createElement('link');
    style.href = linkHref;
    style.rel = 'stylesheet';
    document.querySelector('link[href*="style.css"]').before(style);
  }

  script.onload = callback
}


jQuery(document).ready(function($){

	if (window.devicePixelRatio == 1) {
		$('html').addClass('no-retina');
	}

	const reviewsLogos = $('.reviews-item-logo');
	if (reviewsLogos.length > 1) {
		$('.slick-reviews').after('<div class="slick-reviews-nav"></div>');

		reviewsLogos.each(function(key,item){
			let logo = $(item).clone().addClass('slick-reviews-nav-link').removeClass('reviews-item-logo').attr('data-index',key);
			if(key === 0) { logo.addClass('active') }
			$('.slick-reviews-nav').append(logo);
		})
	}
	let reviewsSlick = $('.slick-reviews').slick({
		arrows: false,
		dots: false,
		autoplay: true,
		autoplaySpeed: 5000,
		// adaptiveHeight: true
	})
	reviewsSlick.on('afterChange',function(slick,currentSlide){
		$('.slick-reviews-nav-link').removeClass('active');
		$('.slick-reviews-nav-link[data-index="'+currentSlide.currentSlide+'"]').addClass('active');
	})
	$(document).on('click','.slick-reviews-nav-link',function(e){
		e.preventDefault();
		const index = parseInt($(this).attr('data-index'),10);
		reviewsSlick.slick('slickGoTo',index);
	})


	$('.publications-video-img').on('click',function(e){
		e.preventDefault();
		$(this).hide();
		$(this).next('.publications-video-video').show();
		document.querySelector('video.publications-video-video').play();
	})


	$(document).on('click','.answer-item-title',function(e){
		e.preventDefault();
		$('.answer-item').not(this).removeClass('opened');
		$(this).closest('.answer-item').toggleClass('opened');
	})

	//плавный скролл с постоянной скоростью
	function smoothScroll(targetOffset,callback) {
		if (callback) {callback()}
		let scroll = $(document).scrollTop();
		let speed = Math.abs(targetOffset - scroll) * 0.85 + 100;
		$('html,body').animate({
			scrollTop: targetOffset - 100
		},speed);
	}


	$(document).on('click','.services-item',function(e){
		e.preventDefault();
		const target = $(this).attr('data-target') || null;
		if (target !== null) {
			let targetOffset = $(target).offset().top;
			smoothScroll(targetOffset,function(){
				$('.answer-item').not(target).removeClass('opened');
				$(target).addClass('opened')
			});
		}
	})

	
	$(document).on('click','.scroll-to, .main-menu a',function(e){
		e.preventDefault();
		let target = $(this).attr('href');
		if ($(target).length) {
			let targetOffset = $(target).offset().top;
			smoothScroll(targetOffset)
		}
	})


	$('form.feedback_form').validate({
		rules: {
			email: {
				email: true
			}
		},
		submitHandler: function(form) {
			showSuccessPopup();
		}
	})
	function showSuccessPopup(){
		$.ajax({
			type: 'GET',
			url: 'ajax/form-success.html',
			success: function(data) {
				$('body').append(data);
			}
		})
	}

	$(document).on('click','.success-form-btn',function(e){
		e.preventDefault();
		$('.modal-wrp, .modal-bg').fadeOut().remove();
	})

});//ready close


const scrollParams = {
	h: window.innerHeight,
	animationCycles: 0
}

//update params
$(window).on('resize',function(){
	scrollParams.h = window.innerHeight
})


//появление блоков при скролле
function scrollIn(elements, scrollTop, windowHeight) {
	let elOffset
	$(elements).each(function(key,item){
		elOffset = $(item).offset().top;
		(scrollTop > elOffset - windowHeight*0.9)
			? $(item).addClass('visible')
			: $(item).removeClass('visible');
	})
}

//анимируем счетчики при скролле
function countersAnim() {
	let scrollTop = $(document).scrollTop();
	$('.promo-advantage').not('.animated').each(function(key,item){
		let elOffset = $(item).offset().top;
		if (scrollTop > elOffset - scrollParams.h*0.9) {
			let counter = $(item).find('.animated-counter');
			jQuery({ Counter: 0 }).animate({ Counter: counter.text() }, {
				duration: 2000,
				easing: 'swing',
				step: function () {
					counter.text(Math.ceil(this.Counter));
				}
			});
			$(item).addClass('animated');
			scrollParams.animationCycles++;
		}
	})
	if (scrollParams.animationCycles >= 4) {
		$(window).off('scroll load',countersAnim);
	}
}


//фиксируем шапку при скролле
function headerSticky(scrollTop) {
	scrollTop <= 5
		? $('header#header').removeClass('scrolled')
		: $('header#header').addClass('scrolled');
}


//параллакс
function parallax(elements, scrollTop) {
	$(elements).each(function(key,item){
		let ratio = +($(item).attr('data-ratio')) || 1;
		let spin = $(item).attr('data-spin') || false;
		let val = (scrollTop/10)*ratio;

		!spin
			? $(item).css('transform',`translate3d(0,${val}px,0)`)
			: $(item).css('transform',`rotate(${val*1.6}deg)`);
	})
}


$(window).on('scroll',function(e) {
	let scroll = $(document).scrollTop();
	
	headerSticky(scroll)
	scrollIn('.scroll-in', scroll, scrollParams.h);
	parallax('.particle', scroll);
})

$(window).on('scroll load',countersAnim);

//фиксы для элементов, завязанных на скролле
$(window).on('load',function(){
	let scroll = $(document).scrollTop();
	headerSticky(scroll)
	scrollIn('.scroll-in',scroll,scrollParams.h);
})