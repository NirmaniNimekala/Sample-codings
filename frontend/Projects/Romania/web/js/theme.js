/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'mage/smart-keyboard-handler',
    'mage/mage',
    'mage/ie-class-fixer',
    'domReady!'
], function ($, keyboardHandler) {
    'use strict';
    if ($('body').hasClass('checkout-cart-index')) {
        if ($('#co-shipping-method-form .fieldset.rates').length > 0 && $('#co-shipping-method-form .fieldset.rates :checked').length === 0) {
            $('#block-shipping').on('collapsiblecreate', function () {
                $('#block-shipping').collapsible('forceActivate');
            });
        }
    }

    $('.cart-summary').mage('sticky', {
        container: '#maincontent'
    });

    $('.panel.header > .header.links').clone().appendTo('#store\\.links');




    $( ".col-mobile-logo .action.nav-toggle" ).click(function() {

        $(".mobile-top-nav-blocks").detach().appendTo(".nav-sections");


    });


    keyboardHandler.apply();



    $('.product.short-description.attribute .go-to-full-desc').click(function (event) {

        event.preventDefault();
        var acnchor = $(this).attr('href').replace(/^.*?(#|$)/, '');

        $(".product.data.items [data-role='content']").each(function(index){
            if (this.id == 'product.info.description') {
                $('.product.data.items').tabs('activate', index);
                $('html, body').animate({
                    scrollTop: $('.product.data.items').offset().top - 50
                }, 300);
            }
        });
    });


    $("input[readonly]").on("focus", function(){
        $(this).blur();
    });

    // PDP qty update - subscription product
    updatQtyOnload();

    if($(".catalog-product-view .membership-select").length  > 0) {
        $('#qty').keyup(function() {
            processQty();
        });
    }

    function processQty() {
        var qtyObj = $("#qty");
        var type = getType();
        var minQty = $('.membership-select .btn.active').find('.radio').attr('data-qty');
        //var minQty = $('.membership-select .btn-group .btn.active').find('.radio').attr('data-qty');
        var limited = disableQty(type);

        // alert(type + "--" + minQty + "--" + limited);

        pdpchangeqty(qtyObj,minQty,limited);
    }

    //update quantity by typing
    function pdpchangeqty(qtyObj,minQty,disableQty){

        var keyupQty = parseInt(qtyObj.val());

        if(disableQty) {
            qtyObj.attr('readonly', true);
            qtyObj.val(minQty);
            return false;
        } else {
            qtyObj.attr('readonly', false);

            if (keyupQty < minQty) {
                qtyObj.val(minQty);
            }
        }

    }

    function getType() {
        return $('.membership-select .btn.active').attr("data-selection");
    }

    function disableQty(type) {

        if(type == "gold" || type == "platinum") {

            return true;

        }

        return false;
    }

    function getMinQty(type) {

        if(type == "gold") {

            return 2;

        } else if (type == "platinum") {

            return 3;

        } else if (type == "diamond") {

            return 4;
        }

        return 1;
    }




    function updatQtyOnload() {
        var membership;
        var qty;

        if (!$("body").hasClass("checkout-cart-configure")) {
            $('.membership-select .btn').each(function() {
                if ($(this).hasClass("active")) {
                    membership =  $(this).find('.radio').val();
                    qty = $(this).find('.radio').attr('data-qty');

                    changeMembership(membership,qty);
                }
            });
        }
    }


    $('.membership-select .btn').each(function() {

        // $(document).ready(function(){
        //     $(".product-price-addtocart-units").hide();
        // });



        $(this).on('click', function (evt) {
            var membership;
            var qty;

            //hide boxes a month label on no-membership
            if($(this).hasClass("no-membership")){
                $(".box-label").hide();
                $(".product-price-addtocart-units").show();
            }
            else{
                $(".box-label").show();
                $(".product-price-addtocart-units").hide();
            }


            evt.stopPropagation();
            evt.preventDefault();
            $('.membership-select .btn').removeClass('active');
            $(this).toggleClass('active');
            membership =  $(this).find('.radio').val();
            qty = $(this).find('.radio').attr('data-qty');

            var type = getType();
            var limited = disableQty(type);

            changeMembership(membership,qty,limited);
        })

    });



    function changeMembership(memb,qty,limited) {

        var subs_Id= $('.membership-select').attr('data-subs-id');
        $('#select_' + subs_Id).val(memb);
        $('#qty').val(qty);

        if (limited){
            $('#qty').parent().find('.incr-btn').addClass('disabled');
            $('#qty').attr('readonly',true)
        }
        else{
            $('#qty').parent().find('.incr-btn').removeClass('disabled');
            $('#qty').attr('readonly',false)
        }

        processQty();

    }


    // Qty increment on PDP
    qtyIncrement();

    function qtyIncrement() {

        var subminqty = $('.membership-select .btn.active').find('.radio').attr('data-qty');

        $(".incr-btn").click(function() {
            var qty = $('#qty');
            var subminqty = $('.membership-select .btn.active').find('.radio').attr('data-qty');

            if($(this).hasClass('disabled')){
                return;
            }


            if ($(this).hasClass("button-up")) {
                if (!qty.attr('disabled')) {
                    var newQty = parseInt(qty.val()) + 1;
                    qty.val(newQty);
                }
            }
            else {
                if (!qty.attr('disabled')) {
                    var newQty = parseInt(qty.val());
                  //  processQty();
                    if (newQty > 1) {
                        newQty--;
                    }
                    qty.val(newQty);


                    if (newQty < subminqty){
                        qty.val(subminqty);
                    }
                }
            }
        });
    }


    //Qty increment on POP

    $(".product-grid .incr-btn").each(function() {
        $(this).on("click", function(){
            var is = $(this);

            popqtyIncrement(is);

        });

    });

    function popqtyIncrement(a) {

       var qty = a.parent().find('.qty');

        var qtybox = a.parent();
        var form =  a.closest('form');

       // var addButton = td.find('button');
       // var minincrval = 0;
       // var minallow = 0;

          //var qty = $('.qty');
           var subminqty = $('.membership-select .btn-group .btn.active').find('.radio').attr('data-qty');

            if(a.hasClass('disabled')){
                return;
            }


            if (a.hasClass("button-up")) {
                if (!qty.attr('disabled')) {
                    var newQty = parseInt(qty.val()) + 1;
                    qty.val(newQty);
                    form.attr('data-qty-incrment',newQty);

                }
            }
            else {
                if (!qty.attr('disabled')) {
                    var newQty = parseInt(qty.val());
                    //  processQty();
                    if (newQty > 1) {
                        newQty--;
                    }
                    qty.val(newQty);
                    form.attr('data-qty-incrment',newQty);


                     if (newQty < subminqty){
                         qty.val(subminqty);
                         form.attr('data-qty-incrment',subminqty);
                     }
                }
            }


    }


    $('.reviews-actions a').click(function (event) {

        event.preventDefault();
        var acnchor = $(this).attr('href').replace(/^.*?(#|$)/, '');
        $(".product.data.items [data-role='content']").each(function(index){
            if (this.id == 'reviews') {
                $('.product.data.items').tabs('activate', index);
                $('html, body').animate({
                    scrollTop: $('#' + acnchor).offset().top - 50
                }, 300);
            }
        });
    });



    jQuery(document).ready(function(){

        $(window).bind('scroll', function() {
            //sticky header
            var divheight = $(".top-link-container").height();
            var navHeight = divheight; // custom nav height

            if ( $( "body" ).hasClass( "filter-active" )){
                $('.header , .mobile-top-links, .nav-toggle').removeClass('goToTop');
                $('.nav-toggle ,.col-menu').removeClass('mobile-menu');
                $('.mobile-top-links, .col-menu').removeClass('goToTop-mobile');

            }else{
                ($(window).scrollTop() > navHeight) ? $('.header, .mobile-top-links , .nav-toggle ').addClass('goToTop') : $('.header , .mobile-top-links, .nav-toggle ').removeClass('goToTop');
                ($(window).scrollTop() > navHeight) ? $('.nav-toggle').addClass('mobile-menu') : $('.nav-toggle ,.col-menu').removeClass('mobile-menu');
                ($(window).scrollTop() > navHeight) ? $('.logo-mobile').addClass('mobile-menu-mobile-logo') : $('.logo-mobile').removeClass('mobile-menu-mobile-logo');
                ($(window).scrollTop() > navHeight) ? $('.mobile-top-links, .col-menu').addClass('goToTop-mobile') : $('.mobile-top-links, .col-menu').removeClass('goToTop-mobile');
            }

        });
    });

    // tooltip mobile and deskto
    jQuery(document).ready(function(){
        if ($(window).width() < 800) {
            var $tooltipBox = $('.tooltiptext');
            var $tooltipTrigger = $('#tooltip-trigger');

            $tooltipTrigger.on("tap", function(e){
                e.preventDefault();
                e.stopPropagation();
                $tooltipBox.css("display","block");
            });
            $(document).on('tap',function(event){
                if (!($tooltipBox.is(event.target)) && ($tooltipBox.has(event.target).length === 0)){
                    $tooltipBox.hide();
                };
            });
        }
        else {
            $('.tooltip-pdp').mouseover(function () {
                $(".tooltip-pdp span").css("display","block");
            });

            $('.tooltip-pdp').mouseleave(function () {
                $(".tooltip-pdp span").css("display","none");
            });
        }
    });

// dont remove the below line of code
    $( ".footer-links .title.mobile" ).on( "click", function() {
       // $( ".footer-links ul" ).toggle();
    });
//end



});



