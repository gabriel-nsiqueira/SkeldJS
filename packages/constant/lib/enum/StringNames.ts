export enum StringNames
{
	ExitButton,
	BackButton,
	AvailableGamesLabel,
	CreateGameButton,
	FindGameButton,
	EnterCode,
	GhostIgnoreTasks,
	GhostDoTasks,
	GhostImpostor,
	ImpostorTask,
	FakeTasks,
	TaskComplete,
	ExileTextSP,
	ExileTextSN,
	ExileTextPP,
	ExileTextPN,
	NoExileSkip,
	NoExileTie,
	ImpostorsRemainS,
	ImpostorsRemainP,
	Hallway,
	Storage,
	Cafeteria,
	Reactor,
	UpperEngine,
	Nav,
	Admin,
	Electrical,
	LifeSupp,
	Shields,
	MedBay,
	Security,
	Weapons,
	LowerEngine,
	Comms,
	Decontamination,
	Launchpad,
	LockerRoom,
	Laboratory,
	Balcony,
	Office,
	Greenhouse,
	DivertPowerTo,
	AcceptDivertedPower,
	SubmitScan,
	PrimeShields,
	FuelEngines,
	ChartCourse,
	StartReactor,
	SwipeCard,
	ClearAsteroids,
	UploadData,
	DownloadData,
	InspectSample,
	EmptyChute,
	EmptyGarbage,
	AlignEngineOutput,
	FixWiring,
	CalibrateDistributor,
	UnlockManifolds,
	ResetReactor,
	FixLights,
	FixComms,
	RestoreOxy,
	CleanO2Filter,
	StabilizeSteering,
	AssembleArtifact,
	SortSamples,
	MeasureWeather,
	EnterIdCode,
	HowToPlayText1,
	HowToPlayText2,
	HowToPlayText5,
	HowToPlayText6,
	HowToPlayText7,
	HowToPlayText81,
	HowToPlayText82,
	NumImpostorsS,
	NumImpostorsP,
	Crewmate,
	Impostor,
	Victory,
	Defeat,
	CrewmatesDisconnected,
	ImpostorDisconnected,
	HowToPlayText41,
	HowToPlayText42,
	HowToPlayText43,
	HowToPlayText44,
	HowToPlayTextMap,
	HowToPlayTextCrew1,
	HowToPlayTextCrew2,
	HowToPlayTextCrew3,
	HowToPlayTextCrew4,
	HowToPlayTextCrew5,
	HowToPlayTextCrew6,
	HowToPlayTextImp1,
	HowToPlayTextImp2,
	HowToPlayTextImp3,
	HowToPlayTextImp4,
	HowToPlayTextImp5,
	HowToPlayTextImp6,
	HowToPlayTextImp7,
	SettingsGeneral,
	SettingsControls,
	SettingsSound,
	SettingsGraphics,
	SettingsData,
	SettingsCensorChat,
	SettingsMusic,
	SettingsSFX,
	SettingsOn,
	SettingsOff,
	SettingsSendTelemetry,
	SettingsControlMode,
	SettingsTouchMode,
	SettingsJoystickMode,
	SettingsKeyboardMode,
	SettingsFullscreen,
	SettingsResolution,
	SettingsApply,
	SettingsPersonalizeAds,
	SettingsLanguage,
	SettingsJoystickSize,
	SettingsMouseMode,
	PlayerColor,
	PlayerHat,
	PlayerSkin,
	PlayerPet,
	GameSettings,
	GameRecommendedSettings,
	GameCustomSettings,
	GameMapName,
	GameNumImpostors,
	GameNumMeetings,
	GameDiscussTime,
	GameVotingTime,
	GamePlayerSpeed,
	GameCrewLight,
	GameImpostorLight,
	GameKillCooldown,
	GameKillDistance,
	GameCommonTasks,
	GameLongTasks,
	GameShortTasks,
	MatchMapName,
	MatchLanguage,
	MatchImpostors,
	MatchMaxPlayers,
	Cancel,
	Confirm,
	Limit,
	RoomCode,
	LeaveGame,
	ReturnToGame,
	LocalHelp,
	OnlineHelp,
	SettingsVSync,
	EmergencyCount,
	EmergencyNotReady,
	EmergencyDuringCrisis,
	EmergencyRequested,
	GameEmergencyCooldown,
	BuyBeverage,
	WeatherEta,
	WeatherComplete,
	ProcessData,
	RunDiagnostics,
	WaterPlants,
	PickAnomaly,
	WaterPlantsGetCan,
	AuthOfficeOkay,
	AuthCommsOkay,
	AuthOfficeActive,
	AuthCommsActive,
	AuthOfficeNotActive,
	AuthCommsNotActive,
	SecLogEntry,
	EnterName,
	SwipeCardPleaseSwipe,
	SwipeCardBadRead,
	SwipeCardTooFast,
	SwipeCardTooSlow,
	SwipeCardAccepted,
	ReactorHoldToStop,
	ReactorWaiting,
	ReactorNominal,
	MeetingWhoIsTitle,
	MeetingVotingBegins,
	MeetingVotingEnds,
	MeetingVotingResults,
	MeetingProceeds,
	MeetingHasVoted,
	DataPolicyTitle,
	DataPolicyText,
	DataPolicyWhat,
	AdPolicyTitle,
	AdPolicyText,
	Accept,
	RemoveAds,
	SwipeCardPleaseInsert,
	LogNorth,
	LogSouthEast,
	LogSouthWest,
	SettingShort,
	SettingMedium,
	SettingLong,
	SamplesPress,
	SamplesAdding,
	SamplesSelect,
	SamplesThanks,
	SamplesComplete,
	AstDestroyed,
	TaskTestTitle,
	BeginDiagnostics,
	UserLeftGame,
	GameStarting,
	Tasks,
	StatsTitle,
	StatsBodiesReported,
	StatsEmergenciesCalled,
	StatsTasksCompleted,
	StatsAllTasksCompleted,
	StatsSabotagesFixed,
	StatsImpostorKills,
	StatsTimesMurdered,
	StatsTimesEjected,
	StatsCrewmateStreak,
	StatsGamesImpostor,
	StatsGamesCrewmate,
	StatsGamesStarted,
	StatsGamesFinished,
	StatsImpostorVoteWins,
	StatsImpostorKillsWins,
	StatsImpostorSabotageWins,
	StatsCrewmateVoteWins,
	StatsCrewmateTaskWins,
	MedscanRequested,
	MedscanWaitingFor,
	MedscanCompleted,
	MedscanCompleteIn,
	MonitorOxygen,
	StoreArtifacts,
	FillCanisters,
	FixWeatherNode,
	InsertKeys,
	ResetSeismic,
	SeismicHoldToStop,
	SeismicNominal,
	ScanBoardingPass,
	OpenWaterways,
	ReplaceWaterJug,
	RepairDrill,
	AlignTelescope,
	RecordTemperature,
	RebootWifi,
	WifiRebootRequired,
	WifiPleasePowerOn,
	WifiPleaseWait,
	WifiPleaseReturnIn,
	WifiRebootComplete,
	Outside,
	GameSecondsAbbrev,
	Engines,
	Dropship,
	Decontamination2,
	Specimens,
	BoilerRoom,
	GameOverImpostorDead,
	GameOverImpostorKills,
	GameOverTaskWin,
	GameOverSabotage,
	GameConfirmImpostor,
	GameVisualTasks,
	ExileTextNonConfirm,
	GameAnonymousVotes,
	GameTaskBarMode,
	SettingNormalTaskMode,
	SettingMeetingTaskMode,
	SettingInvisibleTaskMode,
	PlainYes,
	PlainNo,
	PrivacyPolicyTitle,
	PrivacyPolicyText,
	ManageDataButton,
	UnderstandButton,
	HowToPlayText2Switch,
	ChatRateLimit,
	TotalTasksCompleted,
	ServerNA,
	ServerEU,
	ServerAS,
	ServerSA,
	LangEnglish,
	LangFrench,
	LangItalian,
	LangGerman,
	LangSpanish,
	LangSpanishLATAM,
	LangBrazPort,
	LangPort,
	LangRussian,
	LangJapanese,
	LangKorean,
	LangDutch,
	LangFilipino,
	PlayerName,
	MyTablet,
	Download,
	DownloadComplete,
	DownloadTestEstTimeS,
	DownloadTestEstTimeMS,
	DownloadTestEstTimeHMS,
	DownloadTestEstTimeDHMS,
	Upload,
	Headquarters,
	GrabCoffee,
	TakeBreak,
	DontNeedWait,
	DoSomethingElse,
	NodeTB,
	NodeIRO,
	NodeGI,
	NodePD,
	NodeCA,
	NodeMLG,
	Vending,
	OtherLanguage,
	ImposterAmtAny,
	VitalsORGN,
	VitalsBLUE,
	VitalsRED,
	VitalsBRWN,
	VitalsGRN,
	VitalsPINK,
	VitalsWHTE,
	VitalsYLOW,
	VitalsBLAK,
	VitalsPURP,
	VitalsCYAN,
	VitalsLIME,
	VitalsOK,
	VitalsDEAD,
	VitalsDC,
	ColorOrange,
	ColorBlue,
	ColorRed,
	ColorBrown,
	ColorGreen,
	ColorPink,
	ColorWhite,
	ColorYellow,
	ColorBlack,
	ColorPurple,
	ColorCyan,
	ColorLime,
	MedID,
	MedC,
	MedHT,
	MedBT,
	MedWT,
	MedETA,
	MedHello,
	PetFailFetchData,
	BadResult,
	More,
	Processing,
	ExitGame,
	WaitingForHost,
	LeftGameError,
	PlayerWasBannedBy,
	PlayerWasKickedBy,
	CamEast,
	CamCentral,
	CamNortheast,
	CamSouth,
	CamSouthwest,
	CamNorthwest,
	LoadingFailed,
	LobbySizeWarning,
	Okay,
	OkayDontShow,
	Nevermind,
	Dummy,
	Bad,
	Status,
	Fine,
	OK,
	PetTryOn,
	SecondsAbbv,
	SecurityLogsSystem,
	SecurityCamsSystem,
	AdminMapSystem,
	VitalsSystem,
	BanButton,
	KickButton,
	ReportButton,
	ReportConfirmation,
	ReportBadName,
	ReportBadChat,
	ReportHacking,
	ReportHarassment,
	ReportWhy,
	PolishRuby = 500,
	ResetBreakers,
	Decontaminate,
	MakeBurger,
	UnlockSafe,
	SortRecords,
	PutAwayPistols,
	FixShower,
	CleanToilet,
	DressMannequin,
	PickUpTowels,
	RewindTapes,
	StartFans,
	DevelopPhotos,
	GetBiggolSword,
	PutAwayRifles,
	StopCharles,
	AuthLeftOkay,
	AuthRightOkay,
	AuthLeftActive,
	AuthRightActive,
	AuthLeftNotActive,
	AuthRightNotActive,
	VaultRoom = 550,
	Cockpit,
	Armory,
	Kitchen,
	ViewingDeck,
	HallOfPortraits,
	Medical,
	CargoBay,
	Ventilation,
	Showers,
	Engine,
	Brig,
	MeetingRoom,
	Records,
	Lounge,
	GapRoom,
	MainHall,
	RevealCode,
	DirtyHeader,
	ErrorServerOverload = 700,
	ErrorIntentionalLeaving,
	ErrorFocusLost,
	ErrorBanned,
	ErrorKicked,
	ErrorBannedNoCode,
	ErrorKickedNoCode,
	ErrorHacking,
	ErrorFullGame,
	ErrorStartedGame,
	ErrorNotFoundGame,
	ErrorInactivity,
	ErrorGenericOnlineDisconnect,
	ErrorGenericLocalDisconnect,
	ErrorInvalidName,
	ErrorUnknown,
	ErrorIncorrectVersion,
	ErrorNotAuthenticated,
	VentDirection = 1000,
	VentMove,
	MenuNavigate,
	NoTranslation,
	NsoError,
	QCLocationLaptop = 2000,
	QCLocationSkeld,
	QCLocationMira,
	QCLocationPolus,
	QCSystemsStart,
	QCSystemsKick,
	QCCrewI,
	QCCrewMe,
	QCCrewNoOne,
	QCAccAKilledB,
	QCAccAKilledBNeg,
	QCAccAIsSuspicious,
	QCAccAIsSuspiciousNeg,
	QCAccASawBVent,
	QCAccASawBVentNeg,
	QCAccAWasChasingB,
	QCAccAWasChasingBNeg,
	QCAccAIsLying,
	QCAccAIsLyingNeg,
	QCAccVoteA,
	QCAccVoteANeg,
	QCAccADidntReport,
	QCResYes,
	QCResNo,
	QCResDontKnow,
	QCResDontKnowNeg,
	QCResAWas,
	QCResAWasNeg,
	QCResADid,
	QCResADidNeg,
	QCResVote,
	QCResVoteNeg,
	QCResAWasAtB,
	QCResAWasAtBNeg,
	QCResRip,
	QCResRipNeg,
	QCResLies,
	QCResLiesNeg,
	QCQstWhere,
	QCQstWho,
	QCQstWhoWasWith,
	QCQstWhatWasADoing,
	QCQstWhoFixedA,
	QCQstWhereWasA,
	QCQstBodyOrMeeting,
	QCStaASawB,
	QCStaAWasWithB,
	QCStaADidB,
	QCStaASelfReported,
	QCStaDoubleKill,
	QCStaWasSelfReport,
	QCStaPleaseDoTasks,
	QCStaBodyWasInA,
	QCStaACalledMeeting,
	QCLocation,
	QCSystems,
	QCCrew,
	QCAccusation,
	QCResponse,
	QCQuestion,
	QCStatements,
	ANY,
	ChatType,
	QuickChatOnly,
	FreeChatOnly,
	FreeOrQuickChat,
	DateOfBirth,
	DateOfBirthEnter,
	Month,
	Day,
	Year,
	January,
	February,
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October,
	November,
	December,
	Submit,
	QCMore,
	Success,
	Failed,
	ErrorCreate,
	SuccessCreate,
	Close,
	ErrorLogIn,
	SuccessLogIn,
	AccountInfo,
	Account,
	UserName,
	Height,
	Weight,
	SignIn,
	CreateAccount,
	RequestPermission,
	RandomizeName,
	AccountLinking,
	ChangeName,
	LogOut,
	GuardianWait,
	EmailEdit,
	EmailResend,
	GuestContinue,
	GuardianEmailSent,
	GuardianCheckEmail,
	EditName,
	Name,
	CreateAccountQuestion,
	DoYouWantCreate,
	PermissionRequired,
	NeedPermissionText,
	GuardianEmailTitle,
	Send,
	NewEmail,
	ConfirmEmail,
	EditEmail,
	Loading,
	Welcome,
	DLLNotFoundAccountError,
	ContinueOffline,
	CreateTryAgain,
	WantToLogIn,
	GoOffline,
	PlayAsGuest,
	LogInTitle,
	LogInInfoText,
	ShowAccountSupportID5,
	ShowAccountSupportID4,
	ShowAccountSupportID3,
	ShowAccountSupportID2,
	ShowAccountSupportID1,
	YouAreNotOnline,
	SaveGameOutOfSpaceMessage,
	SaveGameOutOfSpaceConfirm,
	SaveGameOutOfSpaceCancel,
	EngagementScreen,
	EngagementScreenSignIn,
	FollowUs,
	ColorMaroon,
	ColorRose,
	ColorBanana,
	ColorGray,
	ColorTan,
	ColorSunset,
	QuickChatInstructionsStart,
	QuickChatInstructionsChild,
	QuickChatInstructionsGuest,
	QuickChatInstructionsFull,
	SwitchEShopBrowseAll,
	ColorCoral,
	GuardianEmail,
	LocalButton,
	OnlineButton,
	HowToPlayButton,
	FreePlayButton,
	PublicHeader,
	PrivateHeader,
	HostHeader,
	EmergencyMeeting,
	BodyReported,
	PlayAgain,
	QuitLabel,
	DownloadLabel,
	UploadLabel,
	TimeRemaining,
	AnnouncementLabel,
	StartLabel,
	UseLabel,
	KillLabel,
	SabotageLabel,
	VentLabel,
	OptionsLabel,
	ReportLabel,
	CO2Label,
	NutriLabel,
	RADLabel,
	WaterLabel,
	DiscussLabel,
	DeadLabel,
	SkippedVoting,
	ProceedLabel,
	HolidayHatLabel,
	HatLabel,
	PetLabel,
	SkinLabel,
	DoorlogLabel,
	VitalsLabel,
	InsufficientStorageError,
	NetworkError,
	OtherDownloadError,
	DownloadingLabel,
	DownloadSizeLabel,
	SkipVoteLabel,
	LogInInfoTextSwitch,
	WeatherDataDownload,
	BeginLabel,
	QuietLabel,
	LogLabel,
	ReadingLabel,
	UploadingLabel,
	ConnectionLabel,
	GoodLabel,
	PoorLabel,
	NoneLabel,
	ProgressLabel,
	PerfectLabel,
	NoDeadBodiesFound,
	AirshipBundle,
	PolusBundle,
	PolusSkinBundle,
	MiraBundle,
	MiraSkinBundle,
	PetAlien2,
	PetAlien1,
	PetAnimal,
	PetCrewmate,
	PetStickmin,
	PrisonerSkin,
	Cyborg_RHM,
	CCC_Officer,
	VentCleaning,
	CleanUp,
	TermsOfUseTitle,
	PPAndToUTitle,
	ComePlayDiscord,
	SupportEmail,
	SupportIDLabel,
	pk05_davehat,
	pk05_Ellie,
	pk05_Svenhat,
	pk05_Burthat,
	pk05_Ellryhat,
	pk05_monocles,
	pk05_cheesetoppat,
	pk05_Macbethhat,
	pk05_HenryToppat,
	pk05_EllieToppat,
	pk05_GeoffreyToppat,
	InviteFriends
}
