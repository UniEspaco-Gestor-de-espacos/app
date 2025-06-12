let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
imap <C-X>h =Hashbangs()
imap <F7> g
imap <C-Up> 
imap <C-Down> 
inoremap <expr> <Left> pumvisible() ? '' : '<Left>'
inoremap <expr> <Right> pumvisible() ? '' : '<Right>'
imap <expr> <Down> pumvisible() ? '' : 'gj'
imap <expr> <Up> pumvisible() ? '' : 'gk'
nmap  zz
nmap  :-1read ~/.vim/snippets/
nmap  zz
map  e :30Lex
map  to :tabonly
map  ta :tab ball
map  zz :.!~/.vim/scripts/foldmark 
map <silent>  cc :execute "set cc=" . (&colorcolumn == "" ? "80" : "")
map  . :bn
map  , :bp
map  bn :enew
map  P "0P
map  p "0p
map  w :update
vmap <silent>  dd "+c
vmap <silent>  yy "+y
map <silent>  hc :let @/ = ""
map <silent>  hh :set hls!
vnoremap " c""P
vnoremap ' c''P
vnoremap ( c()P
vnoremap * c**P
vmap < <gv
vmap > >gv
vnoremap [ c[]P
vnoremap ` c``P
xnoremap gx <ScriptCmd>vim9.Open(getregion(getpos('v'), getpos('.'), { type: mode() })->join())
nnoremap gx <ScriptCmd>vim9.Open(GetWordUnderCursor())
map j gj
map k gk
vnoremap { c{}P
map <F9> :term make
map <F8> :term gdb
map <F7> g
map <F6> :set list!
map <F5> :term %:p
map <F4> :term
map <F3> :set wrap!
map <F2> :set spell!
map <F1> :set rnu!
nmap <C-S> :-1read ~/.vim/snippets/
nmap <C-U> zz
nmap <C-D> zz
nmap <C-Up> 
nmap <C-Down> 
map <Up> gk
map <Down> gj
inoremap <expr>  pumvisible() ? '' : ''
imap h =Hashbangs()
inoremap "" ""<Left>
inoremap '' ''<Left>
inoremap (( ((  ))2h
inoremap ({ ({  })2h
inoremap () ()<Left>
inoremap <> <><Left>
inoremap [[ [[  ]]2h
inoremap [] []<Left>
inoremap { {}k
inoremap {} {}<Left>
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set background=dark
set complete=.,w,b,u,t,i,kspell
set completeopt=menuone,longest
set confirm
set display=truncate
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set fillchars=vert:â”‚,fold:\ ,eob:~,lastline:@
set guicursor=n-v-c:block,o:hor50,i-ci:hor15,r-cr:hor30,sm:block,a:blinkon0
set helplang=pt
set hidden
set hlsearch
set ignorecase
set incsearch
set langnoremap
set nolangremap
set laststatus=2
set listchars=tab:â€º-,space:Â·,trail:â‹¯,eol:â†²
set nrformats=bin,hex
set path=.,/usr/include,,,**
set ruler
set runtimepath=~/.vim,/usr/share/vim/vimfiles,/usr/share/vim/vim91,/usr/share/vim/vim91/pack/dist/opt/netrw,/usr/share/vim/vimfiles/after,~/.vim/after
set scrolloff=2
set shiftwidth=4
set shortmess=filnxtToOSc
set noshowmode
set smartcase
set smartindent
set softtabstop=4
set spelllang=pt_br,en
set splitbelow
set splitright
set statusline=%0*\ %{toupper(g:currentmode[mode()])}\ %1*\ [%n]\ %t%{&modified!=''?'\ |\ +':''}\ %2*%=%{&ff}\ |\ %{&fenc!=''?&fenc:&enc}\ |\ %{&filetype!=''?tolower(&filetype):'no\ ft'}\ %1*\ %p%%\ %0*\ \ %l:%c\ \ 
set noswapfile
set tabstop=4
set termguicolors
set title
set ttimeout
set ttimeoutlen=100
set undodir=~/.vim/undodir
set undofile
set wildcharm=26
set wildmode=longest,full
set wildoptions=pum
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Projetos/uniespaco/app
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 routes/web.php
argglobal
%argdel
$argadd routes/web.php
edit routes/web.php
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
split
1wincmd k
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 44 + 29) / 59)
exe '2resize ' . ((&lines * 12 + 29) / 59)
argglobal
setlocal keymap=
setlocal noarabic
setlocal noautoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),0],:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinscopedecls=public,protected,private
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,f:#[,:#
setlocal commentstring=/*\ %s\ */
setlocal complete=.,w,b,u,t,i,kspell
setlocal completefunc=
setlocal completeopt=
setlocal concealcursor=
setlocal conceallevel=0
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal cursorlineopt=both
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal eventignorewin=
setlocal expandtab
if &filetype != 'php'
setlocal filetype=php
endif
setlocal fillchars=
setlocal findfunc=
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
set foldmethod=marker
setlocal foldmethod=marker
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatoptions=lqrocb
setlocal formatprg=
setlocal grepformat=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=\\(require\\|include\\)\\(_once\\)\\?
setlocal includeexpr=
setlocal indentexpr=GetPhpIndent()
setlocal indentkeys=0{,0},0),0],:,!^F,o,O,e,*<Return>,=?>,=<?,=*/
setlocal noinfercase
setlocal isexpand=
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal lhistory=10
set linebreak
setlocal linebreak
setlocal nolisp
setlocal lispoptions=
setlocal lispwords=
setlocal nolist
setlocal listchars=
setlocal makeencoding=
setlocal makeprg=
setlocal matchpairs=(:),{:},[:],<:>
setlocal modeline
setlocal modifiable
setlocal nrformats=bin,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=phpcomplete#CompletePHP
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
set relativenumber
setlocal relativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal scrolloff=-1
setlocal shiftwidth=4
setlocal noshortname
setlocal showbreak=
setlocal sidescrolloff=-1
setlocal signcolumn=auto
setlocal nosmartindent
setlocal nosmoothscroll
setlocal softtabstop=4
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=pt_br,en
setlocal spelloptions=
setlocal statusline=
setlocal suffixesadd=.php
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'php'
setlocal syntax=php
endif
setlocal tabstop=4
setlocal tagcase=
setlocal tagfunc=
setlocal tags=
setlocal termwinkey=
setlocal termwinscroll=10000
setlocal termwinsize=
setlocal textwidth=0
setlocal thesaurus=
setlocal thesaurusfunc=
setlocal undofile
setlocal undolevels=-123456
setlocal varsofttabstop=
setlocal vartabstop=
setlocal virtualedit=
setlocal wincolor=
setlocal nowinfixbuf
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
let s:l = 56 - ((33 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 56
normal! 0
wincmd w
argglobal
terminal ++curwin ++cols=236 ++rows=12 
let s:term_buf_3 = bufnr()
balt routes/web.php
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=terminal
setlocal nocindent
setlocal cinkeys=0{,0},0),0],:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinscopedecls=public,protected,private
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*\ %s\ */
setlocal complete=.,w,b,u,t,i,kspell
setlocal completefunc=
setlocal completeopt=
setlocal concealcursor=
setlocal conceallevel=0
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal cursorlineopt=both
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal eventignorewin=
setlocal expandtab
if &filetype != ''
setlocal filetype=
endif
setlocal fillchars=
setlocal findfunc=
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
set foldmethod=marker
setlocal foldmethod=marker
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatoptions=tcq
setlocal formatprg=
setlocal grepformat=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},0),0],:,0#,!^F,o,O,e
setlocal noinfercase
setlocal isexpand=
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal lhistory=10
set linebreak
setlocal linebreak
setlocal nolisp
setlocal lispoptions=
setlocal lispwords=
setlocal nolist
setlocal listchars=
setlocal makeencoding=
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal nomodifiable
setlocal nrformats=bin,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
set relativenumber
setlocal relativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal scrolloff=-1
setlocal shiftwidth=4
setlocal noshortname
setlocal showbreak=
setlocal sidescrolloff=-1
setlocal signcolumn=auto
setlocal smartindent
setlocal nosmoothscroll
setlocal softtabstop=4
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=pt_br,en
setlocal spelloptions=
setlocal statusline=
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != ''
setlocal syntax=
endif
setlocal tabstop=4
setlocal tagcase=
setlocal tagfunc=
setlocal tags=
setlocal termwinkey=
setlocal termwinscroll=10000
setlocal termwinsize=
setlocal textwidth=0
setlocal thesaurus=
setlocal thesaurusfunc=
setlocal undofile
setlocal undolevels=-123456
setlocal varsofttabstop=
setlocal vartabstop=
setlocal virtualedit=
setlocal wincolor=
setlocal nowinfixbuf
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
let s:l = 1 - ((0 * winheight(0) + 6) / 12)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
wincmd w
exe '1resize ' . ((&lines * 44 + 29) / 59)
exe '2resize ' . ((&lines * 12 + 29) / 59)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
set shortmess=filnxtToOSc
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
