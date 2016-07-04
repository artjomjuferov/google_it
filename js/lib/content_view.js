function View() {
    self = this;
    this.show = function() {
        self.element = $('<input/>', {
                id: id
            })
            .css(css_params)
            .appendTo('body');
    }
    this.hide = function() {
        self.element.remove();
    }
}


InputView.prototype = new View();

function InputView(sendQueryToOpener) {
    this.id = 'google_it_extension_input';
    this.css_params = {
        left: "30%",
        top: "40%",
        position: 'fixed',
        width: "600px",
        height: "60px",
        fontSize: 24,
        zIndex: 1024
    };
    this.element.attr("placeholder", "Google it now");
    this.show();
}

BgView.prototype = new View();

function BgView() {
    this.id = 'google_it_extension_bg_shadow';
    this.css_params = {
        left: "0",
        top: "0",
        position: 'fixed',
        width: "100%",
        height: "100%",
        backgroundColor: 'black',
        opacity: 0.7,
        zIndex: 1023
    }
    this.show();
}


function ViewManager(sendQueryToOpener) {
    self = this;

    this.sendQueryToOpener = sendQueryToOpener;

    this.show = function() {
        self.bg = BgView.new();
        self.input = InputView.new();
        self.input.element.focus()
        self.input.element.bind('keyPress', bind);
    }

    function bind() {
        text = $(this).val();
        hideAll();
        sendQueryToOpener(text);
    }

    function hideAll() {
        self.input.hide();
        self.bg.hide();
    }
}
