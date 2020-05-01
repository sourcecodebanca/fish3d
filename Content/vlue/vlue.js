'use strict';

if (window.jQuery) {

    var vlueApp = {
        test__btn: '#vlue__btn_test',
        test__md: 'vlue__md_test',
        vlue__md_updateinfo: 'vlue__md_updateinfo',
        vlue__md_guild: 'vlue__md_guild',
        vlue__md_guild_notloggined: 'vlue__md_guild_notloggined',
        vlue__md_mail: 'vlue__md_mail',
        vlue__md_manageguild: 'vlue__md_manageguild',
        open: function open(__id) {
            $('#' + __id).modal('show');
        },
        init: function init() {
            this.test__only();
            this.datePicker();
            this.checkBox('#table1');
            this.checkBox('#table2');
            this.checkBox('#table3');
        },
        test__only: function test__only() {
            // vlueApp.open("vlue__md_mail");
            // this.log('you are in test only');

            if ($('#home').length > 0) {
                vlueApp.open(vlueApp.test__md);
            }
            if ($('#guild').length > 0) {
                vlueApp.open(vlueApp.vlue__md_guild_notloggined);
            }

            $(this.test__btn).click(function () {
                vlueApp.log('Click to test button');
                vlueApp.open(vlueApp.test__md);
            });
            $("#vlue__btn_test_small").click(function () {
                vlueApp.log('Click to test button');
                vlueApp.open("vlue__md_small");
            });

            $('body').scrollspy({ target: '.navbar-example' });
            this.input();

            $('#btnAgreetest').click(function () {
                console.log(vlueApp.getCheckBoxSelected('#table3'));
            });
        },
        log: function log(message) {
            console.log('vlue App: ' + message);
        },
        input: function input() {
            $(".vlue__form_input-float").on('focus', function () {
                console.log($(this).attr('id'));
                vlueApp.findInputLabel($(this).attr('id')).css('opacity', '1');
            });
            $(".vlue__form_input-float").on('blur', function () {
                if ($(this).val() == '') {
                    vlueApp.findInputLabel($(this).attr('id')).css('opacity', '0');
                }
            });
            $(".vlue__form_input-float").each(function () {
                if ($(this).val() != '') {
                    vlueApp.findInputLabel($(this).attr('id')).css('opacity', '1');
                }
            });
        },
        datePicker: function datePicker() {
            $('.vlue__datepicker').datetimepicker({
                format: 'DD/MM/YYYY'
            });
            $('#datetimepicker12').datetimepicker({
                inline: true,
                sideBySide: true
            });
        },
        findInputLabel: function findInputLabel(_id) {
            return $("label[for='" + _id + "']"); //.css('display', 'block');
        },
        checkBox: function checkBox(_id) {
            var allCls = (_id == undefined ? "" : _id) + ".vlue__table .vlue__table--thead .vlue__chk-all",
                itemClas = (_id == undefined ? "" : _id) + ".vlue__table .vlue__table--tbody .vlue__chk-item",
                tdClas = (_id == undefined ? "" : _id) + ".vlue__table .vlue__table--tbody .vlue__table--td:not('a button input')",
                itemLength = $(itemClas).length;

            $(allCls).on('change', function () {
                if (itemLength > 0) {
                    if ($(this).find('input[type="checkbox"]').is(":checked")) {
                        $(itemClas).find('input[type="checkbox"]').prop('checked', true);
                    } else {
                        $(itemClas).find('input[type="checkbox"]').prop('checked', false);
                    }
                }
            });

            $(itemClas).on('click', function () {
                var selectedItemLength = $(itemClas).find('input[type="checkbox"]:checked').length;
                if (selectedItemLength == itemLength) {
                    $(allCls).find('input[type="checkbox"]').prop('checked', true);
                } else {
                    $(allCls).find('input[type="checkbox"]').prop('checked', false);
                }
            });

            // $(tdClas).on('click', function() {
            //     $(this).find('.vlue__chk-item').find('input[type="checkbox"]').click();
            // });
        },
        getCheckBoxSelected: function getCheckBoxSelected(_id) {
            var itemClas = (_id == undefined ? "" : _id) + ".vlue__table .vlue__table--tbody .vlue__chk-item";
            var _lst = [];
            $(itemClas).find('input[type="checkbox"]:checked').each(function (index, val) {
                _lst.push($(val).data('value'));
            });
            return _lst;
        }
    };

    $(document).ready(function () {
        vlueApp.init();
    });
}