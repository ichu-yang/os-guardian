/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, HelpClaimRequest } from '../types';
import { playCoinSynth, playLevelUpSynth, playErrorBuzz } from '../utils/sound';
import { Calendar, Key, MessageSquare, GitPullRequest, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, Award, FileText } from 'lucide-react';

interface BountyBoardProps {
  tasks: Task[];
  coins: number;
  adminCodeSession: string;
  helpClaims: HelpClaimRequest[];
  onCompleteTask: (taskId: string, coinsGain: number) => void;
  onSetAdminCodeSession: (newCode: string) => void;
  onAddHelpClaim: (claim: HelpClaimRequest) => void;
  onApproveClaim: (claimId: string, coinsReward: number) => void;
  onRejectClaim: (claimId: string) => void;
}

export default function BountyBoard({
  tasks,
  coins,
  adminCodeSession,
  helpClaims,
  onCompleteTask,
  onSetAdminCodeSession,
  onAddHelpClaim,
  onApproveClaim,
  onRejectClaim,
}: BountyBoardProps) {
  // Input states
  const [classCodeInput, setClassCodeInput] = useState('');
  const [classCodeError, setClassCodeError] = useState('');
  const [classCodeSuccess, setClassCodeSuccess] = useState(false);

  // Q&A Solver inputs
  const [qaTitle, setQaTitle] = useState('');
  const [qaDescription, setQaDescription] = useState('');
  const [qaSolverName, setQaSolverName] = useState('');
  const [qaError, setQaError] = useState('');

  // PR Inputs
  const [prUrl, setPrUrl] = useState('');
  const [prRepo, setPrRepo] = useState('');
  const [prError, setPrError] = useState('');
  const [prSuccess, setPrSuccess] = useState(false);

  // Admin Controls
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [newAdminPass, setNewAdminPass] = useState(adminCodeSession);

  // Today ISO String for simple daily check
  const todayStr = new Date().toISOString().split('T')[0];

  // Handler for Daily Punch In
  const handleDailyCheckIn = () => {
    const checkInTask = tasks.find(t => t.id === 'daily_punch');
    if (checkInTask && !checkInTask.completed) {
      onCompleteTask('daily_punch', 10);
      playCoinSynth();
    }
  };

  // Handler for class attendance code verification
  const handleVerifyClassCode = () => {
    setClassCodeError('');
    setClassCodeSuccess(false);

    if (!classCodeInput.trim()) {
      setClassCodeError('請輸入社課通關密碼！');
      playErrorBuzz();
      return;
    }

    if (classCodeInput.trim() === adminCodeSession) {
      setClassCodeSuccess(true);
      onCompleteTask('attend_class', 50);
      playLevelUpSynth();
      setClassCodeInput('');
    } else {
      setClassCodeError('密碼錯誤！請向課堂講師或社團副社長索取。');
      playErrorBuzz();
    }
  };

  // Handler for community Q&A solver
  const handleSubmitQAPending = (e: React.FormEvent) => {
    e.preventDefault();
    setQaError('');

    if (!qaTitle.trim() || !qaDescription.trim() || !qaSolverName.trim()) {
      setQaError('所有欄位皆為必填！');
      playErrorBuzz();
      return;
    }

    const newClaim: HelpClaimRequest = {
      id: `claim_${Date.now()}`,
      time: Date.now(),
      questionTitle: qaTitle.trim(),
      solverName: qaSolverName.trim(),
      description: qaDescription.trim(),
      status: 'PENDING'
    };

    onAddHelpClaim(newClaim);
    playCoinSynth();

    // Reset fields
    setQaTitle('');
    setQaDescription('');
    setQaSolverName('');

    // Trigger a simulated automatic Officer Review after 3 seconds for maximum interactivity!
    setTimeout(() => {
      // Simulate random officer
      const officers = [
        { name: '社長 咸淳 (President)', comment: '超讚的啦！回答得超級細心，感謝大大拯救社團新手！💯' },
        { name: '副社 筱雅 (VP)', comment: '優質社團夥伴認證 ✨！已撥發 OS 金幣獎勵，請繼續保持～' },
        { name: '教學顧問 豪哥 (Tutor)', comment: '這個分析切中要點，完全就是開源精神的模範，厲害。🤖' },
        { name: '活動股長 阿明', comment: '感謝熱心解答！這正是我們開源守護大軍需要的戰力！' }
      ];
      const randomOfficer = officers[Math.floor(Math.random() * officers.length)];

      onApproveClaim(newClaim.id, 100);
      playLevelUpSynth();
    }, 4500);
  };

  // Handler for legendary PR submissions
  const handleVerifyPR = (e: React.FormEvent) => {
    e.preventDefault();
    setPrError('');
    setPrSuccess(false);

    if (!prUrl.trim() || !prRepo.trim()) {
      setPrError('請填寫完整儲存庫名稱與 Pull Request 連結！');
      playErrorBuzz();
      return;
    }

    // Basic URL validation
    const githubPrRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+/;
    if (!githubPrRegex.test(prUrl.trim())) {
      setPrError('不合法的 PR 連結格式！必須為: https://github.com/owner/repo/pull/123');
      playErrorBuzz();
      return;
    }

    onCompleteTask('submit_pr', 500);
    playLevelUpSynth();
    setPrSuccess(true);
    setPrUrl('');
    setPrRepo('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative" id="bounty-board">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" /> 賞金任務板 <span className="text-xs text-slate-500 font-mono">Bounty Board</span>
          </h2>
          <p className="text-xs text-slate-400">為社團與開源專案做出貢獻，領取豐厚的 OS 金幣吧！</p>
        </div>

        {/* Admin toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNewAdminPass(adminCodeSession);
              setIsAdminMode(!isAdminMode);
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
              isAdminMode ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'bg-slate-800 border border-slate-750 text-slate-400'
            }`}
          >
            {isAdminMode ? '🔒 關閉幹部管理' : '🔑 幹部審核後台'}
          </button>
        </div>
      </div>

      {/* Admin Panel content */}
      {isAdminMode && (
        <div className="mb-6 p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
            <Key className="w-3.5 h-3.5" /> 幹部管理面板 (社課密碼公布設定 & Q&A 人工複核)
          </h3>
          <p className="text-[11px] text-amber-300/80 mb-3">
            社團幹部可在此自由更新今日社課的通關口令，或是手動為社員的 Q&A 送審案件進行核淮/驳回。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Update classroom pass */}
            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">社課簽到通關口令設定</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="寫下社課黑板上的詞彙"
                  className="flex-1 px-3 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (newAdminPass.trim()) {
                      onSetAdminCodeSession(newAdminPass.trim());
                      playCoinSynth();
                    }
                  }}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer"
                >
                  發布口令
                </button>
              </div>
              <span className="text-[9px] text-slate-500 block mt-1">目前黑板密碼：<code className="text-amber-400 font-mono bg-slate-900 px-1 py-0.5 rounded">{adminCodeSession}</code></span>
            </div>

            {/* Manual List Audit */}
            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">歷史 Q&A 送審列表</label>
              <div className="max-h-[80px] overflow-y-auto space-y-1.5 text-[10px]">
                {helpClaims.length === 0 ? (
                  <span className="text-slate-500 block text-center py-2">目前尚無社員提交 Q&A 送審</span>
                ) : (
                  helpClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-850">
                      <div className="truncate pr-1">
                        <span className="font-bold text-emerald-400">{claim.solverName}</span>
                        <span className="text-slate-400 ml-1">解決了: "{claim.questionTitle}"</span>
                      </div>
                      <div className="flex gap-1">
                        {claim.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => {
                                onApproveClaim(claim.id, 100);
                                playLevelUpSynth();
                              }}
                              className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded text-[9px]"
                            >
                              准許
                            </button>
                            <button
                              onClick={() => {
                                onRejectClaim(claim.id);
                                playErrorBuzz();
                              }}
                              className="px-1.5 py-0.5 bg-rose-500 text-slate-100 font-bold rounded text-[9px]"
                            >
                              駁回
                            </button>
                          </>
                        ) : (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${claim.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {claim.status === 'APPROVED' ? '已核准' : '已駁回'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Tasks */}
      <div className="space-y-4">
        {/* Task 1: Daily Punch In */}
        <div className={`p-4 rounded-xl border transition-all ${
          tasks.find(t => t.id === 'daily_punch')?.completed
            ? 'bg-slate-950/40 border-slate-850 opacity-75'
            : 'bg-slate-850/40 border-slate-800 hover:border-slate-700'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">[日常] 每日線上簽到</h3>
                  <span className="px-1.5 py-0.5 bg-emerald-500/1s0 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">每日一次</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">每日登入遊戲點擊簽到，立即獲得零用金補貼。</p>
                <span className="text-[10px] text-teal-400 font-bold block mt-1">獎勵：🪙 +10 OS Coins</span>
              </div>
            </div>

            <div>
              {tasks.find(t => t.id === 'daily_punch')?.completed ? (
                <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold px-3 py-1.5 bg-slate-900 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" /> 今日已完成簽到
                </span>
              ) : (
                <button
                  onClick={handleDailyCheckIn}
                  className="w-full sm:w-auto px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  領取金幣 +10
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Task 2: Attend Technology Club lecture */}
        <div className={`p-4 rounded-xl border transition-all ${
          tasks.find(t => t.id === 'attend_class')?.completed
            ? 'bg-slate-950/40 border-slate-850 opacity-75'
            : 'bg-slate-850/40 border-slate-800 hover:border-slate-700'
        }`}>
          <div className="flex items-start gap-3">
            <div className="bg-sky-500/10 text-sky-400 p-2.5 rounded-xl border border-sky-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">[日常] 參加社團實體社課</h3>
                <span className="px-1.5 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold rounded">密碼校驗</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                在實體主辦階梯社課教室中，講師會在投影黑板公佈通關代碼，輸入即可領獎。（測試用：可在管理台更改，預設為 <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded font-mono">{adminCodeSession}</code>）
              </p>
              <span className="text-[10px] text-teal-400 font-bold block mt-1">獎勵：🪙 +50 OS Coins</span>

              {tasks.find(t => t.id === 'attend_class')?.completed ? (
                <div className="mt-3 inline-flex items-center gap-1 text-slate-500 text-xs font-semibold px-3 py-1.5 bg-slate-900 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 已成功參與本週社課簽到
                </div>
              ) : (
                <div className="mt-3 flex flex-col sm:flex-row gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="請輸入黑板公布的口令碼"
                    value={classCodeInput}
                    onChange={(e) => setClassCodeInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleVerifyClassCode}
                    className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    扣口令驗證 🚀
                  </button>
                </div>
              )}

              {classCodeError && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {classCodeError}</p>}
              {classCodeSuccess && <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 通過驗證！50枚 OS金幣已到手！</p>}
            </div>
          </div>
        </div>

        {/* Task 3: Q&A Solver - Honor system with automated Review simulation */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-850/40 hover:border-slate-700">
          <div className="flex items-start gap-3">
            <div className="bg-violet-500/10 text-violet-400 p-2.5 rounded-xl border border-violet-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">[成就] 在社群群組/聊天室幫忙解答技術問題</h3>
                <span className="px-1.5 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold rounded">榮譽送審制</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                在 Discord 討論區、社群群組為社員解答 Git command 或環境建置問題嗎？在此申報並寫下細節即可送審（送審後 4.5 秒內模擬幹部將完成複審並發放獎勵）。
              </p>
              <span className="text-[10px] text-teal-400 font-bold block mt-1">獎勵：🪙 +100 OS Coins (每案)</span>

              {/* Submission Form */}
              <form onSubmit={handleSubmitQAPending} className="mt-4 p-3 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">你的大名/暱稱</label>
                    <input
                      type="text"
                      placeholder="e.g. 程式大師"
                      value={qaSolverName}
                      onChange={(e) => setQaSolverName(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded outline-none focus:border-violet-500 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">被解決的技術難題標題</label>
                    <input
                      type="text"
                      placeholder="e.g. Vite HMR 連接 WS 報錯"
                      value={qaTitle}
                      onChange={(e) => setQaTitle(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded outline-none focus:border-violet-500 text-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">解答過程、指令或對話大綱簡述</label>
                  <textarea
                    rows={2}
                    placeholder="請簡述使用了何種指令或解決對策..."
                    value={qaDescription}
                    onChange={(e) => setQaDescription(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-900 border border-slate-800 rounded outline-none focus:border-violet-500 text-slate-100"
                  />
                </div>

                {qaError && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {qaError}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    申報解答並送交幹部 review ✨
                  </button>
                </div>
              </form>

              {/* Showcase the interactive reviews logs for the user to see proof */}
              {helpClaims.length > 0 && (
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> 申報審核歷史日誌：
                  </span>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {[...helpClaims].reverse().map((claim) => (
                      <div key={claim.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200">
                            👤 {claim.solverName} <span className="text-slate-550 font-normal">Q&A 申報</span>
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            claim.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : claim.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                          }`}>
                            {claim.status === 'APPROVED' ? '審核通過 (🪙 +100)' : claim.status === 'REJECTED' ? '審核駁回' : '🔍 幹部 Reviewing (4s)'}
                          </span>
                        </div>
                        <p className="text-slate-300 font-medium">問題：{claim.questionTitle}</p>
                        <p className="text-[11px] text-slate-450 mt-0.5 italic">" {claim.description} "</p>

                        {claim.reviewComment && (
                          <div className="mt-2 pl-2 border-l-2 border-emerald-500 text-[11px] text-emerald-400 bg-emerald-950/10 p-1.5 rounded-r">
                            <span className="font-bold block">🛡️ 幹部審理意見：</span>
                            {claim.reviewComment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task 4: Legendary PR Submission of git */}
        <div className={`p-4 rounded-xl border transition-all ${
          tasks.find(t => t.id === 'submit_pr')?.completed
            ? 'bg-slate-950/40 border-slate-850 opacity-75'
            : 'bg-emerald-900/10 border-emerald-500/20 hover:border-emerald-550'
        }`}>
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-emerald-500 text-white p-2.5 rounded-xl">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">[傳說] 提交 PR (Pull Request) 到開源專案</h3>
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-bold rounded animate-pulse">神話級</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                向 GitHub 開源專案（無論規模，包含社團共同維護之專案）發起並合併 PR！在此貼上 GitHub Pull Request 完整位址連結進行開源認證。
              </p>
              <span className="text-[10px] text-amber-400 font-bold block mt-1">獎勵：🪙 +500 OS Coins (超多蓄水！)</span>

              {tasks.find(t => t.id === 'submit_pr')?.completed ? (
                <div className="mt-3 inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold px-3 py-1.5 bg-amber-950/20 border border-amber-500/30 rounded-lg">
                  <Award className="w-4 h-4 text-amber-400 animate-spin" /> 偉大的開源奉獻者！PR 認證成功，已獲發 500 金幣！
                </div>
              ) : (
                <form onSubmit={handleVerifyPR} className="mt-3 space-y-2 max-w-xl bg-slate-950/50 p-3 rounded-lg border border-slate-850">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. facebook/react"
                      value={prRepo}
                      onChange={(e) => setPrRepo(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="https://github.com/owner/repo/pull/1"
                      value={prUrl}
                      onChange={(e) => setPrUrl(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  {prError && <p className="text-[10px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {prError}</p>}
                  {prSuccess && <p className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 成功提交 PR 鏈結！500 金幣已入帳！</p>}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                    >
                      提交開源驗證 ⚔️
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
