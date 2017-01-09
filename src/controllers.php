<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

$app->get('/klasor', function () use ($app) {

        $path = "../../folder_list";
        $dir = @opendir($path) or die("$path klasörü açılamıyor.");
        while ($file = readdir($dir)) {
            if($file[0] != "."){
                 if (is_dir($path . "/" . $file) AND ($file != "..") AND ($file != ".") ) {
                $result[] = $file;
                }
            }
        }



    return $app['twig']->render('index.html.twig', array(

        'folders' => $result,

    ));

});
$app->get('/ajax', function (Request $request) use ($app) {

    $klasor = "../../folder_list/";
    $istenen_klasor = $request->get("a");
    $klasorun_icindekiler = glob($klasor.$istenen_klasor."/*") or die ("açılamadı");
    $icindekiler = array();
    for($a=0;$a<count($klasorun_icindekiler);$a++){
        array_push($icindekiler,substr($klasorun_icindekiler[$a],strrpos($klasorun_icindekiler[$a],"/")+1));
    }
    return $app->json($icindekiler);

});

$app->error(function (\Exception $e, Request $request, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    // 404.html, or 40x.html, or 4xx.html, or error.html
    $templates = array(
        'errors/' . $code . '.html.twig',
        'errors/' . substr($code, 0, 2) . 'x.html.twig',
        'errors/' . substr($code, 0, 1) . 'xx.html.twig',
        'errors/default.html.twig',
    );

    return new Response($app['twig']->resolveTemplate($templates)->render(array('code' => $code)), $code);
});
