$(document).ready(function(){
    // ilk olarak ana klas�r�n i�eri�ini g�sterecek fonksiyonu otomatik olarak bir kereli�ine �al��t�r�yor
    // JSON datam�z� php dosyas�ndan al�yoruz.�lk seferde harhengi bir parametre yollam�yoruz
    $.getJSON("directory.php",
        //JSON datas�n� al�n�nca �al��acak fonksiyon
        function(data){

            // id �zniteli�i dircontent olan div katman�na dosya ve klas�r bilsigini koymak �zere
            // bir tane ul elaman� yarat�p i�ine ekliyoruz
            $('#dircontent').append("<ul></ul>");

            // gelen JSON datas�n� anahtar de�erlerine g�re i�leyip her bir dizin i�in
            // li elaman� yarat�p ul elaman� i�ine ekliyoruz.
            // PHP dosyam�zda dizin bilgilerini 'directories' dizisinde  yaratm��t�k
            $.each(data.directories, function(i,directories){
                // dizin bilgisini bu sat�rda ekliyoruz.
                $('#dircontent ul').append(" <li class='directory' > <div class='dir'  directory='"+directories+"' >"+directories+"</div></li>");
            });

            // gelen JSON datas�n� anahtar de�erlerine g�re i�leyip her bir dosya i�in
            // li elaman� yarat�p ul elaman� i�ine ekliyoruz.
            // PHP dosyam�zda dosya bilgilerini 'files' dizisinde yaratm��t�k
            $.each(data.files, function(i,files){
                // dosya bilgisini bu sat�rda ekliyoruz.
                $('#dircontent ul').append(" <li class='file'  > <div  id='"+files+"'> <a href='"+files+"' >"+files+" </a> </div> </li>");
            });

            // dizine t�kland���nda �a�r�lacak 'click' olay�n� burada ba�l�yoruz.
            $('div.dir').bind('click',clck);

        });

});

// dizine t�kland���nda �a�r�lacak fonksiyon
function clck() {

    // $(this) yazarak t�klanan li eleman�n� se�iyoruz.
    // Se�ti�imiz bu li elman�n �st elaman� ul oldu�u i�in
    // daha �nceden t�klan�p herhangi bir li elaman� eklenip
    // eklenmedi�ini kontrol etmek i�in $(this).parent() yazarak
    // t�klanan li elaman�n� i�eren ul elaman�n� se�iyoruz.
    // Art�k ul elaman�n hangi dizine ait oldu�unu 'directory'
    // �zniteli�indeki de�ere bakarak anlayabiliriz.
    // Ayr�ca ul elaman�n  'li' etiketine sahip bir li eleman�
    // olup olmad���n alt elaman say�s�na bakarak anlayabiliriz.

    //t�klanan div elaman�n �st elaman� se�iyoruz : li
    var t=$(this).parent();
    // t�klanan dizinin hangi dizin oldu�u dir de�i�kenine at�yoruz.
    var dir=$(this).attr('directory');
    // ul elaman�n alt elaman� varsa gizledi�imiz alt elamanlar� g�sterterecek
    // kodumuzu burada yaz�yoruz
    if ( t.children('ul').size() > 0 )
    {
        // ul elaman�n� gizliyoruz.
        t.find('ul').hide("fast");
        // e�er ul elaman� daha �nce gizlenmi� ise tekrar g�steriyoruz
        if (t.find('ul').css('display') =='none')
            t.find('ul').show("fast");
        // al�nm�� dizin bilgilerini tekrar almamak i�in return ile 'clck' fonksiyonunu
        // sonland�r�yoruz.
        return;
    }

    // dizin i�iri�ini almam�za yarayacak URL adresine
    // dir de�i�kenini yaz�yoruz. Bu dir anahtar de�i�keni alt klas�r
    // bilgilerini almam�za yarayacak.

    path="directory.php?dir="+dir;

    // JSON ile alt klas�r bilgilerini burada alaca��z.
    $.getJSON(path,
        function(data,dir){

            // i�i bo� olan li elaman�na dizin alt dizin bilgilerini i�erecek
            // ul elaman� ekliyoruz.
            // B�ylece zincirleme <ul><li> <ul><li>...</li> </ul></li></ul>
            // �eklinde hiyerar�ik liste yarat�yoruz.

            t.append("<ul ></ul>");
            // alt elamanlar y�klenen kadar ul ekaman�n� gizleyece�iz.
            t.find('ul').stop().hide();
            // alt dizindeki dosya bilgilerini burada giriyoruz.
            $.each(data.files, function(i,files,dir){
                // alt dizin klas�r bilgilerini burada giriyoruz.
                // burada dikkat etmemiz gereken k�s�m :
                // "+t.find('div').attr('directory') +'/'+files+" ifadesi
                // burada kullan�c� dosyay� t�klad���nda y�nledirilecek
                // adresi ayarl�yoruz.
                t.find('ul').append(" <li class='file' > <div  id='"+files+"'> <a href='"+t.find('div').attr('directory') +'/'+files+"' >"+files+" </a></div> </li>");

            });

            // alt dizin bilgilerini burada giriyoruz.
            $.each(data.directories, function(i,directories,dir){
                // Ayn� teknikle dizin bilgilerini directory �zniti�i olarak
                // div elementine ekliyoruz.
                t.find('ul').append(" <li class='directory'> <div class='dir'  directory='"+t.find('div').attr('directory')+'/'+directories+"' >"+directories+"</div></li>");
            });
            // animasyon ekleyerek ul elemenan� ve i�indeki elemanlar�
            // g�steriyoruz.
            t.find('ul').stop().show("fast");
            // Yeni eklenen div elamanlar�na (alt dizin) click olay�n� ba�l�yoruz.
            $('div.dir').bind('click',clck);

        }
    );

}