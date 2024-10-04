define(["jquery", "qlik", "./html2canvas.min" ],
	function ($, qlik, html2canvas) {

		return {
			support: {
				snapshot: false,
				export: false,
				exportData: false
			},
			initialProperties: {
				showTitles: false,           // 제목 표시 비활성화
				disableNavMenu: true,        // 가리키기 메뉴 비활성화
				showDetails: false           // 세부 정보 표시 비활성화
			},
			// 사용자 정의 속성 패널 정의
			definition: {
				type: "items",
				component: "accordion",
				items: {
					appearance: {
						label: "Custom CSS",
						type: "items",
						items: {
							customCss: {
								ref: "customCss",
								label: "Custom CSS",
								type: "string",
								expression: "optional",
								defaultValue: "width:100%;height:100%;background-color: #f44336;color: white;border: none;border-radius: 4px;cursor: pointer;"  // 기본 CSS
							}
						}
					}
				}
			},
			paint: function ($element, layout) {
				var ownId = this.options.id;
				var customCss = layout.customCss || "width:100%;height:100%;background-color: #f44336;color: white;border: none;border-radius: 4px;cursor: pointer;";

				// 버튼 생성
				//var $button = "<button id='"+ownId+"-btn' style='"+customCss+"'>Scn</button>";
				var $button = $("<button>", {
					id: ownId + "-btn",
					text: "Scn", // 버튼에 표시할 텍스트
					style: customCss
			});
				$element.empty().append($button);
				
				// 기존 스타일 요소 제거
				$("#" + ownId).remove();

				// 스타일 정의
				var style = `
						div[tid="${ownId}"] .qv-object-${ownId},
						div[tid="${ownId}"] .qv-inner-object:not(.visual-cue) {
								border: none!important;
								background: none!important;
								margin: 0!important;
								padding: 0!important;
						}
						#${ownId}_title{
							display: none!important;
						}
				`;

				// 스타일 요소를 헤드에 추가
				$("<style>", { id: ownId }).html(style).appendTo("head");

				// 버튼 클릭 이벤트 처리
				$button.on('click', function () {
					// 캡처할 대상 요소 (Qlik Sense 시트 전체를 대상으로 함)
					var targetElement = $('#grid-wrap');
					
					// html2canvas로 스크린샷 캡처
					html2canvas(targetElement[0]).then(function (canvas) {
						// 캡처된 이미지 데이터를 Data URL로 변환
						var imageData = canvas.toDataURL("image/png");
	
						// 다운로드 링크 생성
						var link = document.createElement('a');
						link.href = imageData;
						link.download = 'qlik_screenshot.png';
						
						// 링크 클릭하여 다운로드 실행
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					});
				});
	
				return qlik.Promise.resolve();
			}
		};
	});

