
function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i<elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

// Hotspots control toggles and swaps
var hotspots;

// Toggles may be turned on and off, either directly or by flipping
var toggles;

// Swaps are always flipped, so must be carefully initialized.
var swaps;

var exes;

var nexsave = [];
var exsave = [];

function visibilitytoggle() {
    
    hotspots = getElementsByClass('hotspot',document,'*');
    toggles = getElementsByClass('toggle',document,'*');
    swaps = getElementsByClass('swap',document,'*');
    dollarss = getElementsByClass('dollars',document,'*');
    centss = getElementsByClass('cents',document,'*');
    finaldollarss = getElementsByClass('finaldollars',document,'*');
    finalcentss = getElementsByClass('finalcents',document,'*');
    exes = getElementsByClass('nst',document,'*');

    for (var i=0; i<hotspots.length; i++) {
        if (hotspots[i].title=="hourpay") {
            hotspots[i].onclick = function() {document.form.dnk.value=1-document.form.dnk.value;toggle('dnktext');toggle(this.title);doCalcs(document.form);};
        }
        else {
            hotspots[i].onclick = function() {toggle(this.title);};
        }
    }
    
    for (var i=0; i<toggles.length; i++) {
        toggles[i].style.display = 'none';
    }
    
    for (var i=0; i<dollarss.length; i++) {
        if (dollarss[i].name=="l1d" || dollarss[i].name=="l1b" || dollarss[i].name=="l2d" || dollarss[i].name=="l3d" || dollarss[i].name=="l4ad" || dollarss[i].name=="l4bd" || dollarss[i].name=="l4cd" || dollarss[i].name=="l4dd" || dollarss[i].name=="l5ad" || dollarss[i].name=="l5bd" || dollarss[i].name=="l5cd" || dollarss[i].name=="l5dd" || dollarss[i].name=="l5ed" || dollarss[i].name=="l6d" || dollarss[i].name=="l7ad" || dollarss[i].name=="l7bd") {
                dollarss[i].disabled=false;
        }
        else {
            dollarss[i].disabled=true;
        }
        dollarss[i].value="0";
        dollarss[i].size="10";
        dollarss[i].maxlength="10";
        dollarss[i].type="text";
        dollarss[i].onchange = function() {doCalcs(document.form);};
        
    }
    for (var i=0; i<centss.length; i++) {
        if (centss[i].name=="l1c" || centss[i].name=="l2c" || centss[i].name=="l4ac" || centss[i].name=="l4bc" || centss[i].name=="l4cc" || centss[i].name=="l4dc") {
                centss[i].disabled=false;
        }
        else {
            centss[i].disabled=true;
        }
        centss[i].value="00";
        centss[i].size="2";
        centss[i].maxlength="2";
        centss[i].type="text";
        centss[i].onchange = function() {doCalcs(document.form);};
    }
    
    for (var i=0; i<finaldollarss.length; i++) {
        finaldollarss[i].disabled=true;
        finaldollarss[i].size="10";
        finaldollarss[i].maxlength="10";
        finaldollarss[i].type="text";
    }
    
    for (var i=0; i<finalcentss.length; i++) {
        finalcentss[i].disabled=true;
        finalcentss[i].size="2";
        finalcentss[i].maxlength="2";
        finalcentss[i].type="text";
    }
    
    toggle('dnktext','on');
    toggle('ppd','on');
  
    initialize_form(document.form);
    
    updateTurnover(document.form, 1);
    

}

function xOut(onoff) {

    var xx = (onoff=='on' ? 'st' : 'nst');
    for (var i=0; i<exes.length; i++) {
        exes[i].className = xx;
    }
    
}

function toggle(ttit, onoff) {

    for (var i=0; i<toggles.length; i++) {    
        if (toggles[i].title==ttit) {
            if (toggles[i].style.display == 'none' && onoff != 'off') {
                toggles[i].style.display = '';
            }
            else {
                if (onoff != 'on') {
                    toggles[i].style.display = 'none';
                    if (ttit=="schedAdetail") {
                        toggle('wl7','off');
                    }
                    if (ttit=="amt") {
                        toggle('amtx','off');
                    }
                    if (ttit=="nrmi") {
                        toggle('nrmiw','off');
                    }
                    if (ttit=="rmi") {
                        toggle('rmiw','off');
                    }
                }
            }
        }
    }

    for (var i=0; i<swaps.length; i++) {
        if (swaps[i].title==ttit) {
            if (swaps[i].style.display == 'none') {
                swaps[i].style.display = '';
            }
            else {
                swaps[i].style.display = 'none';
            }
        }
    }

}

function parseIntw0(n) {

    len = n.length;
    if (len>1) {
        return((n[0]=="0" ? parseIntw0(n.substr(1,len)) : parseInt(n)));
    }
    return(parseInt(n));

}

function parseCurrHelper(fir,rest) {
    var len = rest.indexOf(",");
    if (len<0) return(1000*fir+parseFloat(rest));
    var next = 1000*fir+parseIntw0(rest.substr(0,len));
    var sec = rest.substr(len+1,rest.length);
    return(parseCurrHelper(next,sec));
}

function parseCurr(item) {

    var neg = item.indexOf("-");
    item = item.substring(neg+1,item.length);

    var len = item.indexOf(",");
    if (len<0) return((neg<0 ? 1 : -1)*parseFloat(item));
    return((neg<0 ? 1 : -1)*parseCurrHelper(0,item));

}

function parseCents(ds,cs) {

    var neg = ds.indexOf("-");
    ds = ds.substring(neg+1,ds.length);

    var len = ds.indexOf(",");
    if (len<0) {
        dabs = parseFloat(ds);
    }
    else {
        dabs = parseCurrHelper(0,ds);
    }

    var cabs = parseInt(cs);
    cabs += 100*dabs
    var c = (neg<0 ? 1 : -1)*cabs
        
    return(c);

}

function writeDollarGroup(dg) {
    if (dg<1) return("000");
    if (dg<10) return("00"+dg);
    if (dg<100) return("0"+dg);
    return(dg);
}

function writeDollarsHelper(dollars) {
    if (dollars<1000) return(dollars);
    var fir=Math.floor(dollars/1000);
    var rest=dollars-1000*fir;
    return(writeDollarsHelper(fir)+","+writeDollarGroup(rest));
}

function writeDollars(dollarsncents) {

    if(isNaN(dollarsncents)) {
//        alert("NaN detected!");
        return("NaN");
    }
    
    var neg = (dollarsncents<0 ? -1 : 1);
    var dollars = Math.floor(neg*dollarsncents/100);
        
    if (dollars<1000) return((neg<0 ? "-" : "")+dollars);
    var fir=Math.floor(dollars/1000);
    var rest=dollars-1000*fir;
    return((neg<0 ? "-" : "")+writeDollarsHelper(fir)+","+writeDollarGroup(rest));
    
}

function writeCents(dollarsncents) {

    dollarsncents = Math.abs(dollarsncents);
    var dolls = Math.floor(dollarsncents/100);
    var cents = dollarsncents-100*dolls;

    return (cents<10 ? (cents<1 ? "00" : "0"+cents) : cents);
}

function roundtozero(n) {
    // Rounds n toward zero
    if (n>0) return(Math.floor(n));
    return(Math.ceil(n));
}

function l9(form) {

    var exh = parseCents(form.l5ad.value,"00")+parseCents(form.l5bd.value,"00")+parseCents(form.l5cd.value,"00")+parseCents(form.l5dd.value,"00")+parseCents(form.l5ed.value,"00")+parseCents(form.l7ad.value,"00")+parseCents(form.l8d.value,"00");
    form.exh.value = writeDollars(exh);
    
    var nonexh = parseCents(form.l6d.value,"00")+parseCents(form.l7bd.value,"00")+parseCents(form.nl8d.value,"00");
    form.nonexh.value = writeDollars(nonexh);
    
    var exw = parseCents(form.l1dall.value,form.l1call.value);
    form.exwd.value = writeDollars(exw);
    form.exwc.value = writeCents(exw);
    
    var nonexw = parseCents(form.l2d.value,form.l2c.value);
    form.nonexwd.value = writeDollars(nonexw);
    form.nonexwc.value = writeCents(nonexw);
    
    var tex = exh*exw/100;
    form.texd.value = writeDollars(tex);
    form.texc.value = writeCents(tex);

    var nontex = nonexh*nonexw/100;
    form.tnonexd.value = writeDollars(nontex);
    form.tnonexc.value = writeCents(nontex);
    
    var wagebill = tex+nontex;
    form.wagebilld.value = writeDollars(wagebill);
    form.wagebillc.value = writeCents(wagebill);
    
    var average = wagebill+parseCents(form.l4d.value,form.l4c.value);
    form.averaged.value = writeDollars(average);
    form.averagec.value = writeCents(average);
    
    var total = average*parseCents(form.l3d.value,"00")/100;
    form.totald.value = writeDollars(total);
    form.totalc.value = writeCents(total);

}

function l5(form) {

    var l5a = parseCents(form.l5ad.value,"00");
    form.l5ad.value = writeDollars(l5a);
    var l5b = parseCents(form.l5bd.value,"00");
    form.l5bd.value = writeDollars(l5b);
    var l5c = parseCents(form.l5cd.value,"00");
    form.l5cd.value = writeDollars(l5c);
    var l5d = parseCents(form.l5dd.value,"00");
    form.l5dd.value = writeDollars(l5d);
    var l5e = parseCents(form.l5ed.value,"00");
    form.l5ed.value = writeDollars(l5e);
    
    form.l6d.value = writeDollars(parseCents(form.l6d.value,"00"));
    form.l7ad.value = writeDollars(parseCents(form.l7ad.value,"00"));
    form.l7bd.value = writeDollars(parseCents(form.l7bd.value,"00"));
    
    var d = 0;
    if (form.exempt[0].checked) {
        if (form.nprof[0].checked) {
            toggle('pph','on');
            toggle('ppd','off');
            d = parseCents(form.nisprofh.value,"00");
            form.nisprofh.value = writeDollars(d);
        }
        if (form.nprof[1].checked) {
            toggle('pph','off');
            toggle('ppd','on');
            d = parseCents(form.nisprofd.value,"00");
            form.nisprofd.value = writeDollars(d);
            var h = parseCents(form.nisphours.value,"00");
            form.nisphours.value = writeDollars(h);
            d *= h/100;
        }
        d = Math.round(d/2);
        form.nl8d.value = writeDollars(d);
        form.l8d.value = writeDollars(0);
    }
    if (form.exempt[1].checked) {
        if (form.prof[0].checked) {
            toggle('pph','on');
            toggle('ppd','off');
            d = parseCents(form.isprofh.value,"00");
            form.isprofh.value = writeDollars(d);
            d *= parseCents(form.l1b.value,"00")/100;
        }
        if (form.prof[1].checked) {
            toggle('pph','off');
            toggle('ppd','on');
            d = parseCents(form.isprofd.value,"00");
            form.isprofd.value = writeDollars(d);
            d *= 52*parseCents(form.l1b.value,"00")/1200;
        }
        d = Math.round(d/2);
        form.nl8d.value = writeDollars(0);
        form.l8d.value = writeDollars(d);
    }

    l9(form);

}

function l4(form) {

    var l4a = parseCents(form.l4ad.value,form.l4ac.value);
    form.l4ad.value = writeDollars(l4a);
    form.l4ac.value = writeCents(l4a);
    var l4b = parseCents(form.l4bd.value,form.l4bc.value);
    form.l4bd.value = writeDollars(l4b);
    form.l4bc.value = writeCents(l4b);
    var l4c = parseCents(form.l4cd.value,form.l4cc.value);
    form.l4cd.value = writeDollars(l4c);
    form.l4cc.value = writeCents(l4c);
    var l4d = parseCents(form.l4dd.value,form.l4dc.value);
    form.l4dd.value = writeDollars(l4d);
    form.l4dc.value = writeCents(l4d);
    var l4 = l4a+l4b+l4c+l4d;
    form.l4d.value = writeDollars(l4);
    form.l4c.value = writeCents(l4);

    l5(form);

}

function l3(form) {

    if (form.isex[0].checked) {
        toggle('isexyes','off');
        form.l3d.value = "0";
        form.l3d.disabled = true;
    }
    if (form.isex[1].checked) {
        toggle('isexyes','on');
        form.l3d.disabled = false;
    }
    var dnc = parseCents(form.l3d.value,"00");
    form.l3d.value = writeDollars(dnc);

    l4(form);

}

function l2(form) {

    var dnc = parseCents(form.l2d.value,form.l2c.value);
    form.l2d.value = writeDollars(dnc);
    form.l2c.value = writeCents(dnc);
    
    l3(form);

}

function l1(form) {

    if (form.dnk.value==0) {
        form.l1dall.disabled=false;
        form.l1call.disabled=false;
        form.l1ad.disabled=true;
        form.l1ac.disabled=true;
        var l1 = parseCents(form.l1dall.value,form.l1call.value);
        form.l1dall.value = writeDollars(l1);
        form.l1call.value = writeCents(l1);
        var l1b = parseCents(form.l1b.value,"00");
        form.l1b.value = writeDollars(l1b);

        var l1d = l1;
        form.l1dd.value = form.l1dall.value;
        form.l1dc.value = form.l1call.value;
        var l1c = l1b*52;
        form.l1cd.value = writeDollars(l1c);
        var l1a = l1c*l1d/100;
        form.l1ad.value = writeDollars(l1a);
        form.l1ac.value = writeCents(l1a);        
        
    }
    else {
        form.l1dall.disabled=true;
        form.l1call.disabled=true;
        form.l1ad.disabled=false;
        form.l1ac.disabled=false;
        var l1a = parseCents(form.l1ad.value,form.l1ac.value);
        form.l1ad.value = writeDollars(l1a);
        form.l1ac.value = writeCents(l1a);
        var l1b = parseCents(form.l1b.value,"00");
        form.l1b.value = writeDollars(l1b);
        var l1c = l1b*52;
        form.l1cd.value = writeDollars(l1c);
        var l1d = Math.round(100*l1a/l1c);
        form.l1dd.value = writeDollars(l1d);
        form.l1dc.value = writeCents(l1d);
        form.l1dall.value = form.l1dd.value;
        form.l1call.value = form.l1dc.value;
    }
        
    l2(form);

}

function doCalcs(form) {

    l1(form);
    
    if (form.exempt[0].checked) {
        store_form(form,nexsave);
    }
    if (form.exempt[1].checked) {
        store_form(form,exsave);
    }

}

function initialize_form(form) {

    form.l1dall.value = "50";
    form.l1call.value = "02";
    form.l1ad.value = "104,041";
    form.l1ac.value = "60";
    form.l1b.value = "40";
    form.l2d.value = "15";
    form.l2c.value = "17";

    //  Line 3 Y/N
    nexsave[0] = false;
    exsave[0] = false;
    //  Line 3
    nexsave[1] = "10"
    exsave[1] = "10"
    //  Line 4a
    nexsave[2] = "100";
    nexsave[3] = "00";
    exsave[2] = "1000";
    exsave[3] = "00";
    //  Line 4b
    nexsave[4] = "200";
    nexsave[5] = "00";
    exsave[4] = "4800";
    exsave[5] = "00";
    //  Line 4c
    nexsave[6] = "100";
    nexsave[7] = "00";
    exsave[6] = "3000";
    exsave[7] = "00";
    //  Line 4d
    nexsave[8] = "0";
    nexsave[9] = "00";
    exsave[8] = "0";
    exsave[9] = "00";
    //  Line 5a
    nexsave[10] = "10";
    exsave[10] = "15";
    //  Line 5b
    nexsave[11] = "10";
    exsave[11] = "10";
    //  Line 5c
    nexsave[12] = "20";
    exsave[12] = "48";
    //  Line 5d
    nexsave[13] = "10";
    exsave[13] = "10";
    //  Line 5e
    nexsave[14] = "0";
    exsave[14] = "0";
    //  Line 6
    nexsave[15] = "2";
    exsave[15] = "2";
    //  Line 7a
    nexsave[16] = "16";
    exsave[16] = "32";
    //  Line 7b
    nexsave[17] = "16";
    exsave[17] = "0";

    form.nisprofh.value = "80";
    form.nisprofd.value = "10";
    form.nisphours.value = "8";
    form.isprofh.value = "13";
    form.isprofd.value = "3";
    form.isphours.value = "";

}

function store_form(form,sarray) {

    sarray[0] = form.isex[0].checked;
    sarray[1] = form.l3d.value;
    sarray[2] = form.l4ad.value;
    sarray[3] = form.l4ac.value;
    sarray[4] = form.l4bd.value;
    sarray[5] = form.l4bc.value;
    sarray[6] = form.l4cd.value;
    sarray[7] = form.l4cc.value;
    sarray[8] = form.l4dd.value;
    sarray[9] = form.l4dc.value;
    sarray[10] = form.l5ad.value;
    sarray[11] = form.l5bd.value;
    sarray[12] = form.l5cd.value;
    sarray[13] = form.l5dd.value;
    sarray[14] = form.l5ed.value;
    sarray[15] = form.l6d.value;
    sarray[16] = form.l7ad.value;
    sarray[17] = form.l7bd.value;

   
}

function restore_form(form,sarray) {

    if (sarray[0]) {
        form.isex[0].checked=true;
        form.isex[1].checked=false;
    }
    else {
        form.isex[0].checked=false;
        form.isex[1].checked=true;
    }
    form.l3d.value = sarray[1];
    form.l4ad.value = sarray[2];
    form.l4ac.value = sarray[3];
    form.l4bd.value = sarray[4];
    form.l4bc.value = sarray[5];
    form.l4cd.value = sarray[6];
    form.l4cc.value = sarray[7];
    form.l4dd.value = sarray[8];
    form.l4dc.value = sarray[9];
    form.l5ad.value = sarray[10];
    form.l5bd.value = sarray[11];
    form.l5cd.value = sarray[12];
    form.l5dd.value = sarray[13];
    form.l5ed.value = sarray[14];
    form.l6d.value = sarray[15];
    form.l7ad.value = sarray[16];
    form.l7bd.value = sarray[17];
    
};

function updateTurnover(form) {

    if (form.exempt[0].checked) {
        restore_form(form,nexsave);
        toggle('nexlang','on');
        toggle('exlang','off');
        doCalcs(form);
    }
    if (form.exempt[1].checked) {
        restore_form(form,exsave);
        toggle('nexlang','off');
        toggle('exlang','on');
        doCalcs(form);
    }

}
