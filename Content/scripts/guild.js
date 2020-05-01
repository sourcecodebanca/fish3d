//Guild
var defaultType = {
    type: STYLE_POPUP
};
var GuildClientWebHelper = {
    GetInfoGuild: function () {
		window.open('/bang-hoi', '_blank ');
		return;
		
        Loading.Show();
        $.get("/Guild/IndexNoGuild", defaultType, function (data) {
            GuildClientWebHelper.Show("BANG HỘI", data, GuildClientWebHelper.EnumType.LIST);

            $(".vlue__guild_list").mCustomScrollbar({
                theme: "inset",
                scrollInertia: 100
            });
            $("#vlue__md_guild .vlue__tabs").mCustomScrollbar({
                theme: "inset",
                axis: "x",
                autoExpandScrollbar: true,
                advanced: { autoExpandHorizontalScroll: true },
                scrollInertia: 100
            });
        }).done(function () {
            Loading.Hide();
        });
    },
    GetInfoGuildDetail: function (_alias) {
        Loading.Show();
        $.get("/Guild/Index", { alias: _alias, type: STYLE_POPUP }, function (data) {
            // PopupOhYeaGuildDetail.Show("THÔNG BÁO", data, 0);
            //GuildClientWebHelper.Show("THÔNG TIN BANG HỘI", data, GuildClientWebHelper.EnumType.LIST);
            GuildClientWebHelper.Show("THÔNG TIN BANG HỘI", data, GuildClientWebHelper.EnumType.DETAIL);
        })
            .done(function () {
                Loading.Hide();
                $(".guild-manage-content").mCustomScrollbar({
                    theme: "inset",
                    scrollInertia: 0
                });
            });
    },
    GetEventDetail: function (id, _case) {
        Loading.Show();
        $.get("/Guild/EventDetail", { articleId: id, typeEvent: _case }, function (data) {
            if (_case == 0) {
                $('#tblGuildAllEvent').css({ "display": "none" });
                $('#guildAllEvent').append(data);
            } else {
                PopupOhYeaPolicy.Show("CHÍNH SÁCH BANG HỘI", data, 0);
            }
        })
            .done(function () {
                Loading.Hide();
            });
    },
    BackEventAll: function () {
        $('#tblGuildAllEvent').css({ "display": "table" });
        $('#guildEventDetail').remove();
    },
    OnAddComment: function (_alias, _isGuildMaster, _isGuildMember, _isHaveGuild, _guildFactionId) {
        var _txtComment = CKEDITOR.instances['ckeditor_txtComment'].getData();
        //console.log(desc);
        //return
        //var _txtComment = $("#txtComment").val();        
        if (_txtComment.trim() == "") {
            GuildClientWebHelper.Show("THÔNG BÁO", "Vui lòng nhập nội dung", GuildClientWebHelper.EnumType.ERROR);
            return false;
        }
        else {
            Loading.Show();
            $.post('/Guild/CreateCommentGuild', { alias: _alias, isGuildMaster: _isGuildMaster, isGuildMember: _isGuildMember, txtComment: _txtComment, guildFactionId: _guildFactionId }, function (response) {
                if (response.Code != 0) {
                    GuildClientWebHelper.Show("THÔNG BÁO", "Tạo thảo luận thất bại", GuildClientWebHelper.EnumType.ERROR);
                }
                Loading.Hide();
            }).complete(function () {
                Loading.Hide();
                AjaxLoadHelper.BoxAllCommentGuild(_alias, _isGuildMaster, _isGuildMember, _isHaveGuild, _guildFactionId);
            });

        }

    },
    OnDeleteComment: function (_alias, _arrCommentId) {
        if (_arrCommentId == "" || _arrCommentId == ",") {
            GuildClientWebHelper.Show("THÔNG BÁO", "Chưa chọn thảo luận cần xóa", GuildClientWebHelper.EnumType.ERROR);
            return;
        }
        else {
            GuildClientWebHelper.Show("THÔNG BÁO", "Bạn xóa những thảo luận này ?", GuildClientWebHelper.EnumType.CONFIRM, function (md_result) {
                if (md_result == PopupHelper.RESULT.CONFIRM) {
                    Loading.Show();
                    $.post('/Guild/DeleteCommentGuild', { alias: _alias, arrCommentId: _arrCommentId }, function (response) {
                        if (response.Code == 0) {
                            $("#rowcomment_" + _arrCommentId).remove();
                        } else {
                            GuildClientWebHelper.Show("THÔNG BÁO", "Xóa thảo luận thất bại", GuildClientWebHelper.EnumType.ERROR);
                            return;
                        }
                        Loading.Hide();
                    }).complete(function () {
                        Loading.Hide();
                    });
                }
            });
        }
    },
    CreateGuild: function () {
        Loading.Show();
        $.get("/Guild/CreateGuild", defaultType, function (data) {
            GuildClientWebHelper.Show("TẠO BANG", data, GuildClientWebHelper.EnumType.ADD);
            //PopupOhYeaSm.Show("", data, 0);
        })
            .done(function () {
                Loading.Hide();
            });
    },
    OnBeginCreateGuildSubmit: function () {
        var name = $("#txtGuildName").val();
        if (name.length < 5 || name.length > 30) {
            $("#txtErrorGuild").html("Tên bang từ 5 đến 30 ký tự");
            return false;
        }

        Loading.Show();
        return true;
    },
    SuccessSubmitUpdate: function (result) {
        Loading.Hide();
        $("#txtErrorGuild").html('* ' + result.Message);
        if (result.Code == 0) {
            Loading.Show();
            PopupOhYeaSm.Hide();
            PopupOhYeaGuild.Hide();
            PopupHelper.HidePopup(PopupHelper.Popup.Small.id);
            setTimeout(function () {
                GuildClientWebHelper.GetInfoGuildDetail()
            }, 1500)
        }
    },
    SearchGuild: function (_keyword, _pageSize, _pageIndex, _guildFactionId) {
        Loading.Show();
        $('#guild_search').html('');
        $('#search_guild_loading').toggleClass('vlue--hide');
        $.get("/Guild/SearchGuild", { keyword: _keyword, pageSize: _pageSize, pageIndex: _pageIndex, guildFactionId: _guildFactionId, type: STYLE_POPUP }, function (data) {
            $('#guild_search').html(data);
            $('#search_guild_loading').toggleClass('vlue--hide');
            $("#guild_search .vlue__guild_list").mCustomScrollbar({
                theme: "inset",
                scrollInertia: 100
            });
        }).done(function () {
            Loading.Hide();

        });
    },
    OnBeginSearchGuild: function () {
        Loading.Show();
    },
    OnSuccessSearchGuild: function (result) {
        //console.log('result: ', result);
        Loading.Hide();
        //$('#search_guild_loading').hide();
        $('#guild_search').html(result);
        $(".vlue__guild_list").mCustomScrollbar({
            theme: "inset",
            scrollInertia: 100
        });
    },
    OnSuccessMemberInGuild: function (result) {
        Loading.Hide();
        $('#guild__useringuild').html(result);
    },
    OnApproveJoin: function (_alias, _buttonType) {
        Loading.Show();

        var listID = vlueApp.getCheckBoxSelected();
        var _ids = listID.join();
        if (_ids == "" || _ids == ",") {
            Loading.Hide();
            GuildClientWebHelper.Show("THÔNG BÁO", "Chưa có thành viên nào được chọn", GuildClientWebHelper.EnumType.ERROR);
            return
        }

        $.post('/Guild/ApproveOrReject', { alias: _alias, buttonType: _buttonType, ids: _ids }, function (response) {
            if (response.Code == 0) {
                for (var i = 0; i < listID.length; i++) {
                    $("#tr_" + listID[i]).remove();
                }
                Loading.Hide();
                return
            } else {
                Loading.Hide();
                GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
                return;
            }
        }).complete(function () {
            Loading.Hide();
        });
    },
    UpdateSlogan: function (_alias) {
        Loading.Show();
        var _slogan = $('#txtSloganGuild').val();
        if (_slogan.trim() == "") {
            Loading.Hide();
            GuildClientWebHelper.Show("THÔNG BÁO", "Vui lòng nhập khẩu hiệu bang", GuildClientWebHelper.EnumType.ERROR);
            return;
        }
        $.post('/Guild/EditSlogan', { alias: _alias, slogan: _slogan }, function (response) {
            if (response.Code == 0) {
                $('#txtSloganGuild').val(_slogan);
                Loading.Hide();
                GuildClientWebHelper.Show("THÔNG BÁO", "Cập nhật khẩu hiệu bang thành công.", GuildClientWebHelper.EnumType.ERROR);
                return;
            } else {
                Loading.Hide();
                GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
                return;
            }
        }).complete(function () {
            Loading.Hide();
        });
    },
    UpdateFanpage: function () {
        Loading.Show();
        var _fanpage = $('#txtLinkFanpage').val();
        if (_fanpage.trim() == "") {
            Loading.Hide();
            GuildClientWebHelper.Show("THÔNG BÁO", "Vui lòng nhập địa chỉ facebook.", GuildClientWebHelper.EnumType.ERROR);
            return;
        }

        var FBurl = /^(http|https)\:\/\/www.facebook.com\/.*/i;
        if (!_fanpage.match(FBurl)) {
            Loading.Hide();
            GuildClientWebHelper.Show("THÔNG BÁO", "Địa chỉ bạn nhập không phải facebook.", GuildClientWebHelper.EnumType.ERROR);
            return;
        }

        $.post('/Guild/UpdateEditFanpage', { fanpage: _fanpage }, function (response) {
            if (response.Code == 0) {
                $('#txtLinkFanpage').val(_fanpage);
                Loading.Hide();
                GuildClientWebHelper.Show("THÔNG BÁO", "Cập nhật địa chỉ fanpage thành công.", GuildClientWebHelper.EnumType.ERROR);
                return;
            } else {
                Loading.Hide();
                GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
                return;
            }
        }).complete(function () {
            Loading.Hide();
        });
    },
    GetProfile: function (_userId) {
        Loading.Show();
        $.get("/Guild/GetProfile", { userId: _userId }, function (data) {
            GuildClientWebHelper.Show("THÔNG BÁO", data, GuildClientWebHelper.EnumType.ERROR);
        })
            .done(function () {
                Loading.Hide();
            });
    },
    ChangeAvatarGuild: function (_input) {

        if (_input.files) {

        } else {
            GuildClientWebHelper.Show("THÔNG BÁO", "Không đọc được hình. Lỗi này có thể do trình duyệt phiên bản cũ. Vui lòng liên hệ admin để được hỗ trợ.", GuildClientWebHelper.EnumType.ERROR);
            return;
        }

        if (_input.files && _input.files[0]) {
            var file = _input.files[0];

            var sizeImage = byte2Kb(_input.files[0].size);

            if (sizeImage > 500) {
                GuildClientWebHelper.Show("THÔNG BÁO", "Dung lượng ảnh phải < 500Kb.", GuildClientWebHelper.EnumType.ERROR);
                return;
            }

            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                var preview = document.querySelector('#imgAvatarGuild');

                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    preview.src = reader.result;
                }, false);

                if (file) {
                    reader.readAsDataURL(file);
                }

                var _base64 = $("#imgAvatarGuild").attr("src");

                setTimeout(function () {
                    $.post('/Guild/UploadAvatar', { base64: _base64 }, function (response) {
                        if (response.Code == 0) {
                            Loading.Hide();
                            return
                        } else {
                            Loading.Hide();
                            GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
                            return;
                        }
                    }).complete(function () {
                        Loading.Hide();
                    });
                }, 1500);
            }
        }
    },
    ChangeBannerGuild: function (_input, _bannerId) {
        if (_input.files) {

        } else {
            GuildClientWebHelper.Show("THÔNG BÁO", "Không đọc được hình. Lỗi này có thể do trình duyệt phiên bản cũ. Vui lòng liên hệ admin để được hỗ trợ.", GuildClientWebHelper.EnumType.ERROR);
            return;
        }

        if (_input.files && _input.files[0]) {
            var file = _input.files[0];

            var sizeImage = byte2Kb(_input.files[0].size);

            if (sizeImage > 500) {
                GuildClientWebHelper.Show("THÔNG BÁO", "Dung lượng ảnh phải < 500Kb.", GuildClientWebHelper.EnumType.ERROR);
                return;
            }

            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                var preview = document.querySelector('#imgBannerGuild');

                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    preview.src = reader.result;
                }, false);

                if (file) {
                    reader.readAsDataURL(file);
                }

                var _base64 = $("#imgBannerGuild").attr("src");

                setTimeout(function () {
                    $.post('/Guild/UploadBanner', { base64: _base64, bannerId: _bannerId }, function (response) {
                        if (response.Code == 0) {
                            Loading.Hide();
                            return
                        } else {
                            Loading.Hide();
                            GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
                            return;
                        }
                    }).complete(function () {
                        Loading.Hide();
                    });
                }, 1500);
            }
        }
    },
    QuitGuild: function (_alias) {
        Loading.Show();
        $.post('/Guild/QuitGuild', { alias: _alias }, function (response) {
            if (response.Code == 1044) {
                PopupHelper.HidePopup(PopupHelper.Popup.ManageGuild.id);
                PopupOhYeaGuildDetail.Hide();
            }
            Loading.Hide();
            GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
            return;
        }).complete(function () {
            Loading.Hide();
        });
    },
    JoinGuild: function (_alias) {
        Loading.Show();
        $.post('/Guild/JoinGuild', { alias: _alias }, function (response) {
            if (response.Code == 1036) {
                $('#btnjoinguild').remove()
            }
            Loading.Hide();
            GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
            return;
        }).complete(function () {
            Loading.Hide();
        });
    },
    KickUser: function (_userId) {
        GuildClientWebHelper.Show("THÔNG BÁO", "Bạn có muốn kick thành viên này?", GuildClientWebHelper.EnumType.CONFIRM, function (md_result) {
            if (md_result == PopupHelper.RESULT.CONFIRM) {
                Loading.Show();
                $.post('/Guild/KickUser', { userId: _userId }, function (response) {
                    if (response.Code == 0) {
                        $('#trUserInGuild_' + _userId).remove();
                    }
                    Loading.Hide();
                    GuildClientWebHelper.Show("THÔNG BÁO", response.Message, GuildClientWebHelper.EnumType.ERROR);
                    return;
                }).complete(function () {
                    Loading.Hide();
                });
            }
        });
    },
    ChangePagerIndex: function (ctrl, idx) {
        var $form = $(ctrl).parents('form');
        $form.find('input[name=pageIndex]').val(idx);
        $form.submit();
        return false;
    },
    GetPolicy: function (id, _case) {
        Loading.Show();
        $.get("/Guild/EventDetail", { articleId: id, typeEvent: _case }, function (data) {
            PopupOhYeaPolicy.Show("CHÍNH SÁCH BANG HỘI", data, 0);
        })
            .done(function () {
                Loading.Hide();
            });
    },
    GetReportGuild: function (url, data) {
        Loading.Show();
        $.post(url, data, function (data) {
            $('#content_script_chart').html(data);
        })
            .done(function () {
                Loading.Hide();
            });
    },
    EnumType: { // Show guild by type as list, detail, actions
        LIST: 1,
        DETAIL: 2,
        ACTIONS: 3,
        CONFIRM: 4,
        ERROR: 5,
        ADD: 6,
        UPDATE: 7,
        REMOVE: 8
    },
    Show: function (_title, _content, type, _callback) {
        //console.log(type);
        switch (type) {
            case this.EnumType.LIST:
                switch (STYLE_POPUP) {
                    case 2:
                        PopupOhYeaGuild.Show(_title, data, 0);
                        break;
                    case 3:
                        PopupHelper.Popup.Guild.show(_title, _content);
                        break;
                    default: break;
                }
                break;
            case this.EnumType.DETAIL:
                switch (STYLE_POPUP) {
                    case 2:
                        PopupOhYeaSm.Show(_title, data, 0);
                        break;
                    case 3:
                        //PopupHelper.Popup.Show(PopupHelper.Popup.Small.id, _content, _title);
                        PopupHelper.Popup.ManageGuild.show(_title, _content);
                        break;
                    default: break;
                }
                break;
            case this.EnumType.ADD:
                PopupHelper.Popup.Show(PopupHelper.Popup.Small.id, _content, _title);
                break;
            case this.EnumType.CONFIRM:
                PopupHelper.Popup.Alert.Question(_content, _callback);
                break;
            case this.EnumType.ERROR:
                PopupHelper.Popup.Alert.Alert(_content);
                break;
        }
    }
}
var AjaxLoadHelper = {
    BoxAllCommentGuild: function (_alias, _isGuildMaster, _isGuildMember, _isHaveGuild, _guildFactionId) {
        if ($('#guild__comment').length == 0) {
            return;
        }
        $.ajax({
            url: '/Guild/CommentGuild',
            type: "POST",
            data: {
                "alias": _alias,
                "isGuildMaster": _isGuildMaster,
                "isGuildMember": _isGuildMember,
                "isHaveGuild": _isHaveGuild,
                "guildFactionId": _guildFactionId,
                "type": STYLE_POPUP
            },
            beforeSend: function () {

            },
            success: function (res) {
                $('#guild__comment').html(res);
                setTimeout(function () {
                    $("#guild__comment .vlue__guild_comment-list").mCustomScrollbar({
                        theme: "inset"
                    });

                    $("#guild__comment .vlue__guild_comment-list .vlue__guild_comment-text").mCustomScrollbar({
                        theme: "inset"
                    });
                }, 300);
            },
            error: function () {

            },
            complete: function () {

            }
        });
    },
    BoxAllUserJoinGuild: function (_alias, _isGuildMaster, _isGuildMember, _isHaveGuild, _guildFactionId) {
        if ($('#userwaitingallow').length == 0) {
            return;
        }
        $.ajax({
            url: '/Guild/InfoGuildUserJoin',
            type: "POST",
            data: {
                "alias": _alias,
                "isGuildMaster": _isGuildMaster,
                "isGuildMember": _isGuildMember,
                "isHaveGuild": _isHaveGuild,
                "guildFactionId": _guildFactionId,
                "type": STYLE_POPUP
            },
            beforeSend: function () {

            },
            success: function (res) {
                $('#userwaitingallow').html(res);
            },
            error: function () {

            },
            complete: function () {

            }
        });
    },
}
//End Guild

var PopupOhYeaGuild = {
    EventClose: null,
    Show: function (title, content, callbackhiden) {
        //$('#ohyea__md_manageguild .modal-title').html(title);
        $("#ohyea__md_manageguild .modal-body").html(content);
        PopupOhYeaGuild.EventClose = callbackhiden;
        $("#ohyea__md_manageguild").modal("show");
    },
    Hide: function (callback) {
        $("#ohyea__md_manageguild").modal("hide");
        $("#ohyea__md_manageguild .modal-body").html("");
        if (typeof callback == 'function') {
            callback();
        }
    },
};
var PopupOhYeaGuildDetail = {
    EventClose: null,
    Show: function (title, content, callbackhiden) {
        //$('#ohyea__md_manageguild .modal-title').html(title);
        $("#ohyea__md_manageguild_detail .modal-body").html(content);
        PopupOhYeaGuildDetail.EventClose = callbackhiden;
        $("#ohyea__md_manageguild_detail").modal("show");
    },
    Hide: function (callback) {
        $("#ohyea__md_manageguild_detail").modal("hide");
        $("#ohyea__md_manageguild_detail .modal-body").html("");
        if (typeof callback == 'function') {
            callback();
        }
    },
};
var PopupOhYeaEvent = {
    EventClose: null,
    Show: function (title, content, callbackhiden) {
        $('#ohyea__md_guild_event .modal-title').html(title);
        $("#ohyea__md_guild_event .modal-body").html(content);
        PopupOhYeaEvent.EventClose = callbackhiden;
        $("#ohyea__md_guild_event").modal("show");
    },
    Hide: function (callback) {
        $("#ohyea__md_guild_event").modal("hide");
        $("#ohyea__md_guild_event .modal-body").html("");
        if (typeof callback == 'function') {
            callback();
        }
    },
};
var PopupOhYeaSm = {
    EventClose: null,
    Show: function (title, content, callbackhiden) {
        //$('#ohyea__md_sm_guild .modal-title').html(title);
        $("#ohyea__md_sm_guild .modal-body").html(content);
        PopupOhYeaSm.EventClose = callbackhiden;
        $("#ohyea__md_sm_guild").modal("show");
    },
    Hide: function (callback) {
        $("#ohyea__md_sm_guild").modal("hide");
        $("#ohyea__md_sm_guild .modal-body").html("");
        if (typeof callback == 'function') {
            callback();
        }
    },
};
var PopupOhYeaPolicy = {
    EventClose: null,
    Show: function (title, content, callbackhiden) {
        //$('#ohyea__md_createguild .modal-title').html(title);
        $("#ohyea__md_guild_policy .modal-body").html(content);
        PopupOhYeaPolicy.EventClose = callbackhiden;
        $("#ohyea__md_guild_policy").modal("show");
    },
    Hide: function (callback) {
        $("#ohyea__md_guild_policy").modal("hide");
        $("#ohyea__md_guild_policy .modal-body").html("");
        if (typeof callback == 'function') {
            callback();
        }
    },
}
var PopupOhYeaProfileUser = {
    EventClose: null,
    Show: function (title, content, callbackhiden) {
        //$('#ohyea__md_createguild .modal-title').html(title);
        $("#ohyea__md_guildProfileUser .modal-body").html(content);
        PopupOhYeaPolicy.EventClose = callbackhiden;
        $("#ohyea__md_guildProfileUser").modal("show");
    },
    Hide: function (callback) {
        $("#ohyea__md_guildProfileUser").modal("hide");
        $("#ohyea__md_guildProfileUser .modal-body").html("");
        if (typeof callback == 'function') {
            callback();
        }
    },
}
var PopupOhYeaConfirm = {
    YesNo: function (title, content, yesText, noText, yesCallback, noCalback) {
        var body = '<div class="ohyea__modal-small_title"><h4 class="ohyea__subtitle">' + title + '</h4></div>';
        body += '<div class="ohyea__modal-small_contain">'
        body += '<div><label class="ohyea__color-white">' + content + '</label></div>'
        body += '<button style="text-transform: uppercase" id="btnohyeaConfirmYes" class="ohyea__btn ohyea__btn--small ohyea__btn--default ohyea__btn--uppercase"><label>' + yesText + '</label><span class="pattern"></span><span class="overlay"></span><span class="light"></span></button>';
        body += '<button style="text-transform: uppercase" id="btnohyeaConfirm" class="ohyea__btn ohyea__btn--small ohyea__btn--default ohyea__btn--red ohyea__btn--uppercase ohyea-margin-left-24"><label>' + noText + '</label><span class="pattern"></span><span class="overlay"></span><span class="light"></span></button>';
        body += '</div>';

        $("#ohyea__md_confirm .modal-body").html(body);
        $("#ohyea__md_confirm").modal("show");

        $("#btnohyeaConfirmYes").click(function () {
            $("#ohyea__md_confirm").modal("hide");
            if (typeof yesCallback == 'function') {
                yesCallback();
            }
        });
        $("#btnohyeaConfirm").click(function () {
            $("#ohyea__md_confirm").modal("hide");
            if (typeof noCalback == 'function') {
                noCalback();
            }
        });
    }
}
function GetReportGuild() {
    var url = $('#select_report_guild').val();
    if (url) {
        var data = {
            dateType: 3,
            guildId: $('#guildId_report_guild').val(),
            dateFrom: $('#frDate_report_guild').val(),
            dateTo: $('#toDate_report_guild').val()
        };
        GuildClientWebHelper.GetReportGuild(url, data);
    }
}