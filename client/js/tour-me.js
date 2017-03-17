$(document).ready(function () {
    var tour = new Tour({
            steps: [
                {
                    element: "#project_menu",
                    title: "Project",
                    content: "プロジェクトメニューの説明",
                    path: '/index_tour.html',
                    placement: "right",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                        $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                        $('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_menu",
                    title: "Import",
                    content: "インポートメニューの説明",
                    path: '/index_tour.html',
                    placement: "right",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                        $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                        $('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool",
                    title: "Import",
                    content: "インポートツールの説明",
                    path: '/index_tour.html',
                    placement: "right",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    redirect: function(){
                      document.location.href = 'import_tool_tour.html'
                    },
                    onShown: function (tour){
                        $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                        $('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_1",
                    title: "Step1",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                        $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_2",
                    title: "Step2",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_3",
                    title: "Step3",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_4",
                    title: "Step4",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_5",
                    title: "Step5",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_6",
                    title: "Step6",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_7",
                    title: "Step7",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_8",
                    title: "Step8",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_9",
                    title: "Step9",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_10",
                    title: "Step10",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_11",
                    title: "Step11",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_tool_step_12",
                    title: "Step12",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
{
                    element: "#import_tool_step_13",
                    title: "Step13",
                    content: "",
                    path: '/import_tool_tour.html',
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#import_new_file",
                    title: "Import New File",
                    content: "ここをクリックするとファイルアップローダが立ち上がります。先ほど作成したインポートファイルをここから登録します。",
                    path: '/import_tour.html',
                    placement: "bottom",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#uploaded_file",
                    title: "Imported File List",
                    content: "インポートが完了するとインポートリストにファイルが登録されます。",
                    path: '/import_tour.html',
                    placement: "bottom",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                    },
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#project_create",
                    title: "Create Project",
                    content: "ここをクリックしてインポートファイルからプロジェクトを新規作成します",
                    path: '/import_tour.html',
                    placement: "bottom",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onHidden: function (tour){
                        //$('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#project_input",
                    path: '/projects_new_tour.html',
                    title: "Project Info",
                    content: "プロジェクト名と使用するPHPのバージョンを選択してください",
                    placement: "top",
                    backdrop: true,
                    backdropContainer: '#wrapper',
                    onShown: function (tour){
                      $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                        $('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#create_new_project",
                    path: '/projects_new_tour.html',
                    title: "Create Project",
                    content: "プロジェクトを新規作成する",
                    placement: "top",
                    redirect: function(){
                      document.location.href = 'project_detail_tour.html'
                    },
                    backdrop: true,
                    onHidden: function (tour){
                        $('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#app_detail",
                    path: '/project_detail_tour.html',
                    title: "App",
                    content: "アプリの起動と停止を行います。まずはここからアプリを起動してサイトの記事の編集を行ってください",
                    placement: "top",
                    backdrop: true,
                    onShown: function (tour){
                      $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                        $('body').removeClass('tour-close')   
                    }
                },
                {
                    element: "#sites_detail",
                    path: '/project_detail_tour.html',
                    title: "File",
                    content: "公開サイトへのファイルのジェネレート及び削除を行います。アプリの記事を編集後、ジェネレートを行うと公開サイトに編集した内容が反映されます",
                    placement: "top",
                    backdrop: true,
                    onShown: function (tour){
                      $('body').addClass('tour-open')
                    },
                    onHidden: function (tour){
                      $('body').removeClass('tour-close') 
                      $('#tour_final').modal('show')  
                    },
                    onEnd: function (tour) {
                      $('#tour_final').modal('show')
                    }
                }
            ]});

        // Initialize the tour
        tour.init();
        $("#go_tour").bind('click', function(){
        console.log('aaa');
          $('#welcome_message').modal('hide');
          tour.restart();
        })
        

            });