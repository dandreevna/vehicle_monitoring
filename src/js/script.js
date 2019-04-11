$(function () {
//Выпадающее меню
  var $nav_prod = $('.nav_prod');
  var $a_nav_prod = $('#a_nav_prod');
  $nav_prod.hide();
  $a_nav_prod.on('mouseenter', function () {
    $nav_prod.slideDown(300);
  }); //end on

  $nav_prod.on('mouseleave', function () {
    $nav_prod.slideUp(300);
    flag = 0;
  }); //end on

//Проверка
  let patterns = {
      required: /.+/,
      email: /.+@.+\..+/
  };

//Модальное окно
  
  let $modal_inputs = $('#modal_form .check');

  $("#btn_modal_form").click(function (e) {

    let err = false;

    for(let i = 0; i < $modal_inputs.length; i++){
      let val = $modal_inputs[i].value.trim();
      let validation = $modal_inputs[i].dataset.validation;
      let pattern = (validation in patterns) ? patterns[validation] : /.*/;

      if(pattern.test(val)){
        $modal_inputs[i].classList.remove('err');
      }
      else{
        err = true;
        $modal_inputs[i].classList.add('err');
      }
    }

    if(err){
      e.preventDefault();
    }else{
      sendAjaxForm('result_form', 'modal_form', 'php/mail.php');
      modal.style.display = "none";
      return false;
    }

  }); 

  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName("close")[0];
  $(".btn_modal").click(function () {
    modal.style.display = "block";
  });

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

//желтая секция
  let $yellow_inputs = $('#yellow_form .check');

  $("#yellow_form_btn").click(function (e) {
    let err = false;

    for(let i = 0; i < $yellow_inputs.length; i++){
      let val = $yellow_inputs[i].value.trim();
      let validation = $yellow_inputs[i].dataset.validation;
      let pattern = (validation in patterns) ? patterns[validation] : /.*/;

      if(pattern.test(val)){
        $yellow_inputs[i].classList.remove('err');
      }
      else{
        err = true;
        $yellow_inputs[i].classList.add('err');
      }
    }

    if(err){
      e.preventDefault();
    }else{
      sendAjaxForm('result_form', 'yellow_form', 'php/mail.php');
      return false;
    }
    
  }); 

}); //end ready

function sendAjaxForm(result_form, ajax_form, url) {
  $.ajax({
    url: url,
    type: "POST",
    dataType: "html",
    data: $("#" + ajax_form).serialize(),
    success: function success(response) {
      var result = $.parseJSON(response);
      if (result.name!=0){
        alert(result.name + ', спасибо за Ваш интерес. В ближайшее время с Вами свяжутся.');
      }else{
         alert('Ошибка. Данные не отправлены');
      }
      
    },
    error: function error(response) {
      alert('Ошибка. Данные не отправлены');
    }
  });
}