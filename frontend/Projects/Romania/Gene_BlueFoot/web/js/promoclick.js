/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'jquery/ui'
], function($) {
    "use strict";

    $.widget('mage.promoClick', {

        options: {
            name:'',
            creative :'',
            position:'',
            id:''

        },

        _create: function() {
            let name = this.options.name;
            let creative = this.options.creative;
            let position = parseInt(this.options.position);
            let id = this.options.id;


                this._bindClick(name,creative,position,id);


        },

        _bindClick: function(name,creative,position,id) {
            var self = this;
            this.element.on('click', function(e) {
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    'event': 'promotionClick',
                    'ecommerce': {
                        'promoClick': {
                            'promotions': [{
                                'name': name,
                                'creative': creative,
                                'position': position,
                                'id': id
                            }]
                        }
                    }
                });

            });

        }


    });

    return $.mage.promoClick;
});