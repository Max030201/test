window.addEventListener('DOMContentLoaded', function() {
  function getApp(cb) {
    const xhr = new XMLHttpRequest();
    const requestURL = '/server/server.json'
    xhr.open('GET', requestURL);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-url');
    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText)
      cb(response);
    })
    xhr.send();
  }

  getApp(response => {
    Ext.create('Ext.tree.Panel', {
      title: 'Магазин игрушек',
      width: 200,
      height: 200,
      rootVisible: true,
      renderTo: Ext.get('items'),
      root: {
          text: 'Категории товаров',
          expanded: true,
          children:
          [{
              text: "Для мальчиков",
              children: [{
                  text: "Mobicaro",
                  leaf: true
              }, {
                  text: "LEGO",
                  leaf: true
              }, {
                  text: "Laffi",
                  leaf: true
              }],
              leaf: false,
              "expanded": false
          },
          {
              text: "Для девочек",
              children: [{
                 text: "Demi Star",
                 leaf: true
              }, {
                 text: "LEGO",
                 leaf: true
              }, {
                 text: "Laffi",
                 leaf: true
              }],
              leaf: false,
              "expanded": false
          }]
      }
    });

    let checkboxGroup = new Ext.form.CheckboxGroup({
      columns: 1,
      fieldLabel: 'Производители',
      name: 'manufacturers',
      style: {
      padding: '5px 10px 5px 10px'
      },
      items: [{
          xtype: 'checkbox',
          boxLabel: 'Все производители',
          name: 'manufacturers',
          inputValue: 'all',
          id: 'all',
          checked:'true',
          listeners: {
            afterrender: function(cmp) {
                cmp.getEl().set({
                    "data-filter": "all"
                });
            }
          }
        },{
          xtype: 'checkbox',
          boxLabel: 'Mobicaro',
          name: 'manufacturers',
          inputValue: 'mobicaro',
          id: 'mobicaro',
          listeners: {
            afterrender: function(cmp) {
                cmp.getEl().set({
                    "data-filter": "mobicaro"
                });
            }
          }
        },{
          xtype: 'checkbox',
          boxLabel: 'Demi Star',
          name: 'manufacturers',
          inputValue: 'demi star',
          id: 'demiStar',
          listeners: {
            afterrender: function(cmp) {
                cmp.getEl().set({
                    "data-filter": "demistar"
                });
            }
          }
        },{
          xtype: 'checkbox',
          boxLabel: 'LEGO',
          name: 'manufacturers',
          inputValue: 'lEGO',
          id: 'lEGO',
          listeners: {
            afterrender: function(cmp) {
                cmp.getEl().set({
                    "data-filter": "lego"
                });
            }
          }
        },{
          xtype: 'checkbox',
          boxLabel: 'Laffi',
          name: 'manufacturers',
          inputValue: 'laffi',
          id: 'laffi',
          listeners: {
            afterrender: function(cmp) {
                cmp.getEl().set({
                    "data-filter": "laffi"
                });
            }
          }
        }]
    });

    let panel = new Ext.Panel({
          renderTo: Ext.get(nav),
          title: 'Производители',
          width: 260,
          height: 200,
          items: [checkboxGroup]
    });

    response.forEach(element => {
      let descr = element.descr;
      let bigDescr = element.bigDescr;
      let comments = element.comment;
      let manufacturer = element.manufacturer;
      let price = element.price;

      element = Ext.create('Ext.panel.Panel', {
        title: element.name,
        headerPosition: 'bottom',
        id: element.id,
        width: 250,
        height: 200,
        cls: (element.category + " panel-back all"),
        rootVisible: true,
        renderTo: Ext.get('container'),
        items: [{
          xtype: 'panel',
          html: element.price + '₽',
          cls: 'pan',
        }],
        listeners: {
          afterrender: function(cmp) {
              cmp.getEl().set({
                  "data-hystmodal": "#"+"modal"+"-"+element.id,
              });
          }
        }
      });
      element.addCls(element.category)

      let input = document.createElement('input');
      let divHystmodal = document.createElement('div');
      let divHystmodalWrap = document.createElement('div');
      let divHystmodalWindow = document.createElement('div');
      let buttonClose = document.createElement('button');
      let buttonAdd = document.createElement('button');
      let priceDiv = document.createElement('div');
      input.setAttribute('id', "pr"+element.id);
      input.value = 1;
      input.textContent = "1"
      buttonAdd.setAttribute('data-pr', "pr"+element.id);
      divHystmodal.setAttribute('aria-hidden', true);
      divHystmodal.setAttribute('id', "modal"+"-"+element.id);
      divHystmodalWindow.setAttribute('aria-modal', true);
      divHystmodalWindow.setAttribute('role', "dialog");
      buttonClose.setAttribute('data-hystclose', "");
      divHystmodalWindow.setAttribute('id', "modalContent-"+element.id);
      input.classList.add('inp');
      buttonAdd.classList.add('btn-m', 'incart');
      buttonAdd.textContent = "Заказать"
      divHystmodal.classList.add('hystmodal');
      divHystmodalWrap.classList.add('hystmodal__wrap');
      divHystmodalWindow.classList.add('hystmodal__window');
      buttonClose.classList.add('hystmodal__close');
      priceDiv.classList.add('modal-price');
      priceDiv.textContent = price + '₽';
      divHystmodalWindow.classList.add('modal');
      divHystmodalWindow.append(priceDiv);
      divHystmodalWindow.append(buttonClose);
      divHystmodalWrap.append(divHystmodalWindow);
      divHystmodal.append(divHystmodalWrap);
      document.getElementById('modal-container').append(divHystmodal);
      divHystmodalWindow.append(input)
      divHystmodalWindow.append(buttonAdd )

      const myModal = new HystModal({
        catchFocus: false,
        backscroll: false,
        linkAttributeName: "data-hystmodal",
      });

      Ext.create('Ext.tab.Panel', {
        title: false,
        width: 400,
        height: 400,
        items:[{
            title: 'Краткое описание',
            html: descr,
            items:[{
              title: false,
              html: "Производитель: " + manufacturer,
              cls: 'manufacturer-modal'
            }]
        },{
            title: 'Полное описание',
            html: bigDescr
        },{
          title: 'Отзывы',
          items:[{
            title: comments[0].nameHuman,
            html: comments[0].commentText,
            margin: '0 0 10 0',
          },{
            title: comments[1].nameHuman,
            html: comments[1].commentText,
          }]
        }],
        renderTo: ("modalContent-"+element.id),
      });
    });

    let res = document.querySelectorAll('.panel-back')
    let field = document.querySelectorAll('.x-field')
    let el = document.querySelectorAll('.panel-back')

    function filter (category, res) {
      res.forEach((listItem) => {
        const isItemFiltered = !listItem.classList.contains(category)
        const isShowAll = category.toLowerCase() === 'all'
        const isShowMobicaro = category.toLowerCase() === 'mobicaro'
        const isShowDemiStar = category.toLowerCase() === 'demistar'
        const isShowLego = category.toLowerCase() === 'lego'
        const isShowLaffi = category.toLowerCase() === 'laffi'
        const isShowLifestyle = category.toLowerCase() === 'lifestyle'

        if (isItemFiltered && !isShowAll) {
          listItem.classList.add('hide')
        } else {
          listItem.classList.remove('hide')
        }
        if (isItemFiltered && !isShowMobicaro) {
          listItem.classList.add('hide')
        } else {
          listItem.classList.remove('hide')
        }
        if (isItemFiltered && !isShowDemiStar) {
          listItem.classList.add('hide')
        } else {
          listItem.classList.remove('hide')
        }
        if (isItemFiltered && !isShowLego) {
          listItem.classList.add('hide')
        } else {
          listItem.classList.remove('hide')
        }
        if (isItemFiltered && !isShowLaffi) {
          listItem.classList.add('hide')
        } else {
          listItem.classList.remove('hide')
        }
        if (isItemFiltered && !isShowLifestyle) {
          listItem.classList.add('hide')
        } else {
          listItem.classList.remove('hide')
        }

      })
    };

    field.forEach((item) => {
      item.addEventListener('click', () => {
        const currentCategory = item.dataset.filter
        filter(currentCategory, el)
        console.log(currentCategory)
      })
    });
  })

    // Отобразим содержимое хранилища
    function ref_cart() {
      var output = "";
      $(".cart li").remove();
      for (var i = 0; i < localStorage.length; i++) {
          output += "<li>ID: "+localStorage.key(i)+" | Количество: "+localStorage.getItem(localStorage.key(i))+" <button data-pr='"+localStorage.key(i)+"' class='remove'> X </button></li>";
      }
      $(".cart").append(output);
  }

  // проверка совместимости
  function web_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
      return false;
    }
  }

  ref_cart();

// Добавить в корзину
$(".incart").on('click', function() {
  var reg = /[0-9]/,
      id = $(this).attr("data-pr"),
      kolvo = $("#"+id).val();

  if (reg.test(kolvo)) {
      if(web_storage()) {
          $("#"+id).val('');
          localStorage.setItem(id, kolvo);
          ref_cart();
      } else{
        alert("Ваш браузер не может работать с локальным хранилищем!");
      }
  } else {
      $("#"+id).val('');
      alert("Использовать только числа!");
  }
});

  // Удалить из корзины
  $(document.body).on('click','.remove',function() {
      localStorage.removeItem($(this).attr("data-pr"));
      $(this).parent('li').remove();
  });
})


