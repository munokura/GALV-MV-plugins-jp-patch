//=============================================================================
// GALV_Superman_Patch.js
//
// ----------------------------------------------------------------------------
// Copyright (C) 2020 ecf5DTTzl6h6lJj02
//	This software is released under the MIT lisence.
//	http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// by ecf5DTTzl6h6lJj02
// 2020/01/27
//=============================================================================

/*:
 * @plugindesc 『Galv's Superman Ability』ゲームパッド対応パッチ
 * @author ecf5DTTzl6h6lJj02
 * 
 * @param Gamepad Key
 * @text ゲームパッドキー設定
 * @desc ジャンプに使うゲームパッドのボタンを設定します。
 * @type select
 * @option none
 * @option cancel
 * @option pageup
 * @option pagedown
 * @option shift
 * @default cancel
 *
 * @param Gamepad Dash Button
 * @text ダッシュボタン変更機能
 * @desc ゲームパッドキー設定で shift が選択されている時
 * cancel ボタンをダッシュとして使用するか。
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 * 
 * @help 『Galv's Superman Ability ゲームパッド対応パッチ』(GALV_Superman_Parch.js)
 * Galv's Jump Ability で、ゲームパッドでの動作に対応させるためのパッチです。
 * 
 * プラグインパラメータ 『ゲームパッドキー設定 （Gamepad Key)』について
 * 　リストから、ジャンプに使用するゲームパッドのボタンを選択してください。
 * 　('ok' や 'menu' に設定できないのは仕様です。)
 * 　初期値は 'cancel' (ゲームパッドの ボタン1)に設定されています。
 * 
 * プラグインパラメータ『ダッシュボタン変更機能 （Gamepad Dash Button)』
 * 　Galv's Tools とほぼ同様の機能です。
 * 　ゲームパッドで、本来ダッシュ機能を割り当てられている shift ボタンを選択している場合、
 * 　このパラメータがYES(true)であれば、cancel ボタンでダッシュするようになります。
 * 
 * 利用規約:
 * MITライセンスとして作成しています。
 * http://opensource.org/licenses/mit-license.php
 *
 * このプラグイン(パッチ)は、改変、再配布、共に可能です。
 * このプラグイン、これを改変したプラグインの販売はお止めください。
 *
 */
 
 
(function() {
	//プラグインパラメータの追加取得
	Galv.SUPER.gamepadKey = PluginManager.parameters('Galv_Superman_Patch')["Gamepad Key"];
	Galv.SUPER.overwriteDash = PluginManager.parameters('Galv_Superman_Patch')["Gamepad Dash Button"].toLowerCase() === 'true' ? true : false;
	
	//shift キーのジャンプボタン化、及び、cancel キーへのダッシュ機能付与
	if( Galv.SUPER.gamepadKey === 'shift' && Galv.SUPER.overwriteDash){
		//コンフィグでキー割り当てを変えていた場合に備えて
		var keyNumber = Object.keys(Input.gamepadMapper)[Object.values(Input.gamepadMapper).indexOf('shift')];
		//shift キーを fly キーに
		Input.gamepadMapper[keyNumber] = 'fly';
		//ゲームパッドキー設定を none (なし)に
		Galv.SUPER.gamdpadKey = 'none';
		
		//cancelキーにダッシュ機能をつける
		Game_Player.prototype.isDashButtonPressed = function(){
			var shift = Input.isPressed('shift') || Input.isPressed('cancel');
			if(ConfigManager.alwaysDash)		return !shift;
			else	return shift;
		}
	}
	
	//ゲームパッドに対応させるための再定義
	Game_Player.prototype.moveByInput = function() {
		var keyNumber = Object.keys(Input.gamepadMapper)[Object.values(Input.gamepadMapper).indexOf(Galv.SUPER.gamepadKey)];
		if (this.canMove() && 
		(Input.isTriggered('fly') || (Input._gamepadStates.some(pad => pad[keyNumber]) && Input._pressedTime === 0)) &&
		 !this.isJumping()) {
			if (this.isNormal && !$gameSystem.disableFly) this.doFlightChange();
		};
		Galv.SUPER.Game_Player_moveByInput.call(this);
	};
})();
