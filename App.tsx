import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Screen =
  | "splash"
  | "welcome"
  | "create"
  | "otp"
  | "kyc"
  | "pin"
  | "login"
  | "home"
  | "send"
  | "recipient"
  | "review"
  | "success"
  | "activity"
  | "profile"
  | "personal"
  | "receipt"
  | "addMoney";
type Tab = "home" | "send" | "activity" | "profile";
const C = {
  bg: "#faf8ff",
  ink: "#131b2e",
  variant: "#404941",
  muted: "#707a71",
  primary: "#004225",
  primary2: "#0a5c36",
  onPrimary: "#fff",
  pale: "#eaedff",
  pale2: "#f2f3ff",
  border: "#dae2fd",
  green: "#a8f3c1",
  coral: "#f25d50",
  red: "#ba1a1a",
  gold: "#fd992e",
  white: "#fff",
};
const A = {
  logo: require("./assets/afriflow-logo.png"),
  profile: require("./assets/profile-jeremiah.jpg"),
  ng: require("./assets/nigeria-flag.jpg"),
  ne: require("./assets/niger-flag.jpg"),
};

function Logo({ header = false }: { header?: boolean }) {
  return (
    <View style={header ? S.brand : S.logoWrap}>
      <Image
        source={A.logo}
        resizeMode="contain"
        style={header ? S.logoHeader : S.logoLarge}
      />
      {header && <Text style={S.brandName}>AfriFlow</Text>}
    </View>
  );
}
function Button({
  title,
  onPress,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        S.button,
        secondary && S.secondaryButton,
        pressed && S.pressed,
      ]}
    >
      <Text style={[S.buttonText, secondary && S.secondaryText]}>{title}</Text>
    </Pressable>
  );
}
function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={S.header}>
      <Pressable onPress={onBack} style={S.back}>
        <Text style={S.backGlyph}>‹</Text>
      </Pressable>
      <Text style={S.headerTitle}>{title}</Text>
      <View style={S.back} />
    </View>
  );
}
function AuthHeader({ title, go }: { title: string; go: (s: Screen) => void }) {
  return (
    <View style={S.authHeader}>
      <Pressable
        onPress={() => go("home")}
        style={S.authBack}
        accessibilityLabel="Go back"
      >
        <Text style={S.authBackGlyph}>{"\u2039"}</Text>
      </Pressable>
      <Text style={S.authTitle}>{title}</Text>
      <Image source={A.logo} style={S.authLogo} />
    </View>
  );
}
const COUNTRIES = [
  { name: "Nigeria", code: "+234", flag: A.ng },
  { name: "Niger", code: "+227", flag: A.ne },
];
function CountryPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (country: (typeof COUNTRIES)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    COUNTRIES.find((country) => country.name === value) || COUNTRIES[0];
  return (
    <>
      <View style={S.field}>
        <Text style={S.label}>{label}</Text>
        <Pressable
          style={[S.input, S.countryInput]}
          onPress={() => setOpen(true)}
        >
          <Image source={selected.flag} style={S.countryFlag} />
          <Text style={S.countryValue}>{selected.name}</Text>
          <Text style={S.countryChevron}>⌄</Text>
        </Pressable>
      </View>
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={S.modalShade}>
          <View style={S.countryModal}>
            <View style={S.modalHeader}>
              <View>
                <Text style={S.modalEyebrow}>SUPPORTED COUNTRIES</Text>
                <Text style={S.modalTitle}>Choose a country</Text>
              </View>
              <Pressable onPress={() => setOpen(false)}>
                <Text style={S.modalClose}>×</Text>
              </Pressable>
            </View>
            {COUNTRIES.map((country) => (
              <Pressable
                key={country.name}
                style={[
                  S.countryOption,
                  country.name === selected.name && S.countryOptionSelected,
                ]}
                onPress={() => {
                  onChange(country);
                  setOpen(false);
                }}
              >
                <Image source={country.flag} style={S.countryFlagLarge} />
                <View style={S.countryOptionText}>
                  <Text style={S.countryName}>{country.name}</Text>
                  <Text style={S.countryCode}>{country.code}</Text>
                </View>
                <Text style={S.countryCheck}>
                  {country.name === selected.name ? "✓" : ""}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}
function Field({
  label,
  value,
  setValue,
  placeholder,
  keyboardType = "default",
  secure = false,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
  keyboardType?: "default" | "phone-pad" | "numeric";
  secure?: boolean;
}) {
  return (
    <View style={S.field}>
      <Text style={S.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#98a2b3"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        style={S.input}
      />
    </View>
  );
}
function Nav({ active, go }: { active: Tab; go: (s: Screen) => void }) {
  const items: [Tab, string, string, Screen][] = [
    ["home", "⌂", "Home", "home"],
    ["send", "▷", "Send", "send"],
    ["activity", "◷", "Activity", "activity"],
    ["profile", "♙", "Profile", "profile"],
  ];
  return (
    <View style={S.nav}>
      {items.map(([key, icon, label, target]) => (
        <Pressable key={key} style={S.navItem} onPress={() => go(target)}>
          <Text style={[S.navIcon, key === active && S.active]}>{icon}</Text>
          <Text style={[S.navLabel, key === active && S.active]}>{label}</Text>
          {key === active && <View style={S.dot} />}
        </Pressable>
      ))}
    </View>
  );
}
function Shell({
  children,
  active,
  go,
}: {
  children: React.ReactNode;
  active: Tab;
  go: (s: Screen) => void;
}) {
  return (
    <View style={S.shell}>
      {children}
      <Nav active={active} go={go} />
    </View>
  );
}
function Splash({ go }: { go: () => void }) {
  useEffect(() => {
    const t = setTimeout(go, 2400);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <View style={S.splash}>
      <View style={S.splashCard}>
        <Logo />
      </View>
      <Text style={S.splashName}>AfriFlow</Text>
      <Text style={S.splashTag}>Money moves. Borders don&apos;t.</Text>
      <View style={S.splashDot} />
    </View>
  );
}
function Welcome({ go }: { go: (s: Screen) => void }) {
  return (
    <ScrollView contentContainerStyle={S.welcome}>
      <View style={S.hero}>
        <View style={S.welcomeLogo}>
          <Logo />
        </View>
        <Text style={S.display}>
          Send money across{`\n`}
          <Text style={S.primaryText}>Nigeria & Niger</Text>
        </Text>
        <View style={S.underline} />
        <Text style={S.heroCopy}>
          Move money between NGN and XOF{`\n`}quickly, securely and
          transparently.
        </Text>
        <View style={S.currencySwitch}>
          <View style={S.currencySelected}>
            <Image source={A.ng} style={S.flag} />
            <Text style={S.currencyText}>NGN</Text>
          </View>
          <Text style={S.swap}>⇄</Text>
          <View style={S.currencySide}>
            <Text style={S.currencyText}>XOF</Text>
            <Image source={A.ne} style={S.flag} />
          </View>
        </View>
      </View>
      <View>
        <Button title="Get Started  →" onPress={() => go("create")} />
        <Pressable onPress={() => go("login")}>
          <Text style={S.already}>I already have an account</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
function Create({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("Nigeria");
  return (
    <KeyboardAvoidingView
      style={S.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={S.createPage}>
        <Pressable
          onPress={() => go("welcome")}
          style={S.createBack}
          accessibilityLabel="Go back"
        >
          <Text style={S.createBackGlyph}>{"\u2039"}</Text>
        </Pressable>
        <Text style={S.title}>Create your AfriFlow account</Text>
        <Text style={S.copy}>
          Join the secure digital bridge for borderless transactions.
        </Text>
        <Field
          label="Full Name"
          value={name}
          setValue={setName}
          placeholder="e.g. Kwame Mensah"
        />
        <Field
          label="Email Address"
          value={email}
          setValue={setEmail}
          placeholder="you@example.com"
        />
        <CountryPicker
          label="Country / Phone Code"
          value={country}
          onChange={(item) => setCountry(item.name)}
        />
        <View style={S.field}>
          <Text style={S.label}>Phone Number</Text>
          <View style={S.phoneRow}>
            <View style={S.prefix}>
              <Text style={S.prefixText}>
                {COUNTRIES.find((item) => item.name === country)?.code}
              </Text>
              <Text style={S.prefixArrow}>⌄</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="800 000 0000"
              placeholderTextColor="#bfc9bf"
              keyboardType="phone-pad"
              style={S.phoneInput}
            />
          </View>
        </View>
        <View style={S.field}>
          <Text style={S.label}>Password</Text>
          <View style={S.passwordRow}>
            <Text style={S.passwordIcon}>●</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              placeholderTextColor="#bfc9bf"
              secureTextEntry={!showPassword}
              style={S.passwordInput}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)}>
              <Text style={S.eye}>{showPassword ? "◉" : "◌"}</Text>
            </Pressable>
          </View>
          <View style={S.strengthRow}>
            <View style={S.strengthBar} />
            <View style={S.strengthInactive} />
            <View style={S.strengthInactive} />
            <View style={S.strengthInactive} />
          </View>
          <Text style={S.strengthText}>Password strength: Weak</Text>
        </View>
        <View style={S.createSpacer} />
        <View style={S.trust}>
          <Text style={S.trustIcon}>♧</Text>
          <Text style={S.trustText}>
            Your data is encrypted with bank-grade security. We never share your
            details.
          </Text>
        </View>
        <Button title="Create Account  →" onPress={() => go("otp")} />
        <Text style={S.loginFooter}>
          Already have an account?{" "}
          <Text style={S.primaryText} onPress={() => go("login")}>
            Log in
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function VerifyExact({
  kind,
  go,
}: {
  kind: "otp" | "pin";
  go: (s: Screen) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [pin, setPin] = useState("");
  const [seconds, setSeconds] = useState(59);
  const inputs = useRef<Array<TextInput | null>>([]);
  const otp = kind === "otp";
  useEffect(() => {
    if (!otp || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [otp, seconds]);
  return (
    <KeyboardAvoidingView
      style={S.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={S.verifyPage}>
        <Pressable
          onPress={() => go(otp ? "create" : "kyc")}
          style={S.verifyBack}
          accessibilityLabel="Go back"
        >
          <Text style={S.backGlyph}>{"\u2039"}</Text>
        </Pressable>
        <View style={S.center}>
          <View style={S.iconCircle}>
            <Image source={A.logo} resizeMode="contain" style={S.otpLogo} />
            <Text style={S.icon}>♧</Text>
          </View>
          <Text style={S.title}>
            {otp ? "Verify your account" : "Create your PIN"}
          </Text>
          <Text style={S.verifyCopy}>
            {otp ? (
              <>
                We&apos;ve sent a 6-digit verification code to{" "}
                <Text style={S.bold}>+254 712 *** 890</Text>.
              </>
            ) : (
              "Set a 4-digit PIN to protect every transfer."
            )}
          </Text>
          {otp ? (
            <View style={S.otpRow}>
              {digits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => {
                    const next = value.replace(/\D/g, "").slice(-1);
                    const updated = [...digits];
                    updated[index] = next;
                    setDigits(updated);
                    if (next && index < 5) inputs.current[index + 1]?.focus();
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !digits[index] &&
                      index > 0
                    )
                      inputs.current[index - 1]?.focus();
                  }}
                  maxLength={1}
                  keyboardType="numeric"
                  style={S.otpBox}
                  accessibilityLabel={`Digit ${index + 1}`}
                />
              ))}
            </View>
          ) : (
            <TextInput
              value={pin}
              onChangeText={setPin}
              maxLength={4}
              keyboardType="numeric"
              secureTextEntry
              placeholder="••••"
              placeholderTextColor="#98a2b3"
              style={S.otp}
            />
          )}
          {otp && (
            <View style={S.resendRow}>
              <Text style={S.resendLabel}>Didn&apos;t receive the code?</Text>
              <Text style={[S.resendLink, seconds > 0 && S.disabled]}>
                {seconds > 0
                  ? `Resend (00:${String(seconds).padStart(2, "0")})`
                  : "Resend"}
              </Text>
            </View>
          )}
          <Button
            title={otp ? "Verify Code  →" : "Continue  →"}
            onPress={() => go(otp ? "kyc" : "login")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function Verify({
  kind,
  go,
}: {
  kind: "otp" | "pin";
  go: (s: Screen) => void;
}) {
  const [code, setCode] = useState("");
  const otp = kind === "otp";
  return (
    <KeyboardAvoidingView
      style={S.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={S.page}>
        <Header
          title={otp ? "Verify phone number" : "Create security PIN"}
          onBack={() => go(otp ? "create" : "kyc")}
        />
        <View style={S.center}>
          <View style={S.iconCircle}>
            <Text style={S.icon}>{otp ? "✉" : "•••"}</Text>
          </View>
          <Text style={S.title}>
            {otp ? "Verify your identity" : "Create your PIN"}
          </Text>
          <Text style={S.copy}>
            {otp
              ? "Enter the 6-digit code sent to your phone number."
              : "Set a 4-digit PIN to protect every transfer."}
          </Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            maxLength={otp ? 6 : 4}
            keyboardType="numeric"
            secureTextEntry={!otp}
            placeholder={otp ? "000000" : "••••"}
            placeholderTextColor="#98a2b3"
            style={S.otp}
          />
          <Button
            title="Continue  →"
            onPress={() => go(otp ? "kyc" : "login")}
          />
          <Text style={S.resend}>
            {otp ? "Didn’t receive a code? " : ""}
            <Text style={S.primaryText}>Resend</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function DobPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(6);
  const [year, setYear] = useState(1995);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const commit = () => {
    onChange(
      `${String(day).padStart(2, "0")} / ${String(month).padStart(2, "0")} / ${year}`,
    );
    setOpen(false);
  };
  const adjust = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number,
    min: number,
    max: number,
  ) => setter((v) => Math.min(max, Math.max(min, v + delta)));
  return (
    <>
      <View style={S.field}>
        <Text style={S.label}>Date of Birth</Text>
        <Pressable style={[S.input, S.dateInput]} onPress={() => setOpen(true)}>
          <Text style={value ? S.dateValue : S.datePlaceholder}>
            {value || "Select your date of birth"}
          </Text>
          <Text style={S.calendarIcon}>▣</Text>
        </Pressable>
        <Text style={S.dateHint}>
          Used only to verify your identity. You must be 18 or older.
        </Text>
      </View>
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={S.modalShade}>
          <View style={S.dateModal}>
            <View style={S.modalHeader}>
              <View>
                <Text style={S.modalEyebrow}>PERSONAL INFORMATION</Text>
                <Text style={S.modalTitle}>When were you born?</Text>
              </View>
              <Pressable onPress={() => setOpen(false)}>
                <Text style={S.modalClose}>×</Text>
              </Pressable>
            </View>
            <Text style={S.modalCopy}>Select your date of birth below.</Text>
            <View style={S.dateColumns}>
              {[
                [day, setDay, 1, 31, "Day"],
                [month, setMonth, 1, 12, months[month - 1]],
                [year, setYear, 1920, new Date().getFullYear() - 18, "Year"],
              ].map(([selected, setter, min, max, label], index) => (
                <View style={S.dateColumn} key={index}>
                  <Text style={S.dateColumnLabel}>{label as string}</Text>
                  <Pressable
                    onPress={() =>
                      adjust(
                        setter as React.Dispatch<React.SetStateAction<number>>,
                        1,
                        min as number,
                        max as number,
                      )
                    }
                  >
                    <Text style={S.dateArrow}>▲</Text>
                  </Pressable>
                  <Text style={S.dateSelected}>
                    {String(selected).padStart(index === 1 ? 2 : 1, "0")}
                  </Text>
                  <Pressable
                    onPress={() =>
                      adjust(
                        setter as React.Dispatch<React.SetStateAction<number>>,
                        -1,
                        min as number,
                        max as number,
                      )
                    }
                  >
                    <Text style={S.dateArrow}>▼</Text>
                  </Pressable>
                </View>
              ))}
            </View>
            <Button title="Use this date" onPress={commit} />
          </View>
        </View>
      </Modal>
    </>
  );
}
function KycExact({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState(""),
    [dob, setDob] = useState(""),
    [nationality, setNationality] = useState(""),
    [address, setAddress] = useState("");
  const [document, setDocument] = useState("passport");
  return (
    <ScrollView contentContainerStyle={S.kycPage}>
      <Pressable onPress={() => go("otp")} style={S.verifyBack}>
        <Text style={S.backGlyph}>{"\u2039"}</Text>
      </Pressable>
      <Text style={S.title}>Verify your identity</Text>
      <Text style={S.copy}>
        We need a few details to secure your account and comply with financial
        regulations.
      </Text>
      <Text style={S.section}>Personal Information</Text>
      <Field
        label="Full Legal Name"
        value={name}
        setValue={setName}
        placeholder="e.g. Jane Doe"
      />
      <DobPicker value={dob} onChange={setDob} />
      <CountryPicker
        label="Nationality"
        value={nationality}
        onChange={(country) => setNationality(country.name)}
      />
      <Field
        label="Residential Address"
        value={address}
        setValue={setAddress}
        placeholder="Street address, City, ZIP"
      />
      <Text style={S.section}>Identity Document</Text>
      <Text style={S.documentHelp}>
        Select a valid government-issued ID to upload.
      </Text>
      <View style={S.documentTypes}>
        <Pressable
          onPress={() => setDocument("passport")}
          style={[
            S.documentType,
            document === "passport" && S.documentSelected,
          ]}
        >
          <Text style={S.documentIcon}>▣</Text>
          <Text
            style={
              document === "passport" ? S.documentSelectedText : S.documentText
            }
          >
            Passport
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setDocument("id_card")}
          style={[S.documentType, document === "id_card" && S.documentSelected]}
        >
          <Text style={S.documentIcon}>▤</Text>
          <Text
            style={
              document === "id_card" ? S.documentSelectedText : S.documentText
            }
          >
            ID Card
          </Text>
        </Pressable>
      </View>
      <Pressable style={S.documentUpload}>
        <Text style={S.uploadIcon}>＋</Text>
        <Text style={S.uploadTitle}>Upload document</Text>
        <Text style={S.uploadCopy}>Tap to select a photo or file</Text>
      </Pressable>
      <View style={S.security}>
        <Text style={S.securityTitle}>♧ Your connection is secure</Text>
        <Text style={S.securityCopy}>
          Your data is encrypted. We do not share your information with third
          parties.
        </Text>
      </View>
      <Button title="Continue  →" onPress={() => go("pin")} />
    </ScrollView>
  );
}
function PinExact({ go }: { go: (s: Screen) => void }) {
  const [pin, setPin] = useState<string[]>(Array(4).fill("")),
    [confirm, setConfirm] = useState<string[]>(Array(4).fill(""));
  const pinInputs = useRef<Array<TextInput | null>>([]);
  const confirmInputs = useRef<Array<TextInput | null>>([]);
  const setDigit = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    values: string[],
    index: number,
    value: string,
  ) => {
    const next = [...values];
    next[index] = value.replace(/\D/g, "").slice(-1);
    setter(next);
  };
  const boxes = (
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    prefix: string,
    refs: React.MutableRefObject<Array<TextInput | null>>,
  ) => (
    <View style={S.pinBoxes}>
      {values.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            refs.current[index] = ref;
          }}
          value={value}
          onChangeText={(v) => {
            const next = v.replace(/\D/g, "").slice(-1);
            setDigit(setter, values, index, next);
            if (next && index < 3) refs.current[index + 1]?.focus();
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && !values[index] && index > 0)
              refs.current[index - 1]?.focus();
          }}
          maxLength={1}
          keyboardType="numeric"
          secureTextEntry
          style={S.pinBox}
          accessibilityLabel={`${prefix} digit ${index + 1}`}
        />
      ))}
    </View>
  );
  return (
    <KeyboardAvoidingView
      style={S.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={S.pinPage}>
        <View style={S.pinTop}>
          <Pressable onPress={() => go("kyc")} style={S.verifyBack}>
            <Text style={S.backGlyph}>{"\u2039"}</Text>
          </Pressable>
        </View>
        <View style={S.pinHero}>
          <View style={S.pinIcon}>
            <Image source={A.logo} resizeMode="contain" style={S.pinLogo} />
            <Text style={S.icon}>♧</Text>
          </View>
          <Text style={S.pinTitle}>Create your transaction PIN</Text>
          <Text style={S.pinCopy}>
            Your PIN will be required to authorize transfers.
          </Text>
        </View>
        <View style={S.pinGroup}>
          <Text style={S.pinLabel}>Enter your 4-digit PIN</Text>
          {boxes(pin, setPin, "PIN", pinInputs)}
        </View>
        <View style={[S.pinGroup, !pin.join("") && S.pinDisabled]}>
          <Text style={S.pinLabel}>Confirm your 4-digit PIN</Text>
          {boxes(confirm, setConfirm, "Confirmation", confirmInputs)}
        </View>
        <View style={S.pinHint}>
          <Text style={S.pinHintIcon}>♧</Text>
          <Text style={S.pinHintText}>Never share your PIN with anyone.</Text>
        </View>
        <Button title="Save PIN  →" onPress={() => go("login")} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function Kyc({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState(""),
    [dob, setDob] = useState("");
  return (
    <ScrollView contentContainerStyle={S.page}>
      <Header title="Identity verification" onBack={() => go("otp")} />
      <Text style={S.title}>Verify your identity</Text>
      <Text style={S.copy}>
        We need a few details to keep your account safe and compliant.
      </Text>
      <Text style={S.section}>PERSONAL INFORMATION</Text>
      <Field
        label="Full name"
        value={name}
        setValue={setName}
        placeholder="As shown on your ID"
      />
      <Field
        label="Date of birth"
        value={dob}
        setValue={setDob}
        placeholder="DD / MM / YYYY"
      />
      <Text style={S.section}>IDENTITY DOCUMENT</Text>
      <Pressable style={S.upload}>
        <Text style={S.uploadIcon}>＋</Text>
        <Text style={S.uploadTitle}>Upload a document</Text>
        <Text style={S.uploadCopy}>
          National ID, passport or driver&apos;s licence
        </Text>
      </Pressable>
      <View style={S.security}>
        <Text style={S.securityTitle}>⌁ Your information is protected</Text>
        <Text style={S.securityCopy}>
          Documents are encrypted and used only for verification.
        </Text>
      </View>
      <Button title="Continue  →" onPress={() => go("pin")} />
    </ScrollView>
  );
}
function Login({ go }: { go: (s: Screen) => void }) {
  const [id, setId] = useState(""),
    [pin, setPin] = useState("");
  return (
    <KeyboardAvoidingView
      style={S.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={S.page}>
        <Header title="Welcome back" onBack={() => go("welcome")} />
        <Logo header />
        <Text style={S.title}>Log in to AfriFlow</Text>
        <Text style={S.copy}>Access your account and keep money moving.</Text>
        <Field
          label="Email or phone number"
          value={id}
          setValue={setId}
          placeholder="Email or phone number"
        />
        <Field
          label="PIN"
          value={pin}
          setValue={setPin}
          placeholder="••••"
          keyboardType="numeric"
          secure
        />
        <Text style={S.forgot}>Forgot your PIN?</Text>
        <Button title="Log in  →" onPress={() => go("home")} />
        <Text style={S.resend}>
          New to AfriFlow?{" "}
          <Text style={S.primaryText} onPress={() => go("create")}>
            Create an account
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function Home({ go }: { go: (s: Screen) => void }) {
  const tx = [
    ["Abdoulaye Diallo", "Sent to Niamey", "-₦15,000"],
    ["Ibrahim Traoré", "Sent to Zinder", "-₦42,500"],
    ["Aisha Bello", "Received from Maradi", "+₦8,200"],
  ];
  return (
    <Shell active="home" go={go}>
      <ScrollView contentContainerStyle={S.appPage}>
        <View style={S.dashboardHeader}>
          <Image
            source={A.logo}
            resizeMode="contain"
            style={S.dashboardBrandLogo}
          />
          <Pressable
            onPress={() => go("personal")}
            accessibilityLabel="Open personal information"
          >
            <Image source={A.profile} style={S.dashboardProfile} />
          </Pressable>
        </View>
        <Text style={S.greeting}>Good morning 👋</Text>
        <Text style={S.greetingSub}>Send money between Nigeria & Niger</Text>
        <View style={S.balance}>
          <View style={S.rowBetween}>
            <Text style={S.balanceLabel}>Total Balance</Text>
            <Text style={S.eye}>◉</Text>
          </View>
          <Text style={S.balanceAmount}>₦250,000.00</Text>
          <Text style={S.balanceXof}>≈ 85,000 XOF</Text>
          <View style={S.balanceButtons}>
            <Pressable style={S.sendButton} onPress={() => go("send")}>
              <Text style={S.actionWhite}>▷ Send</Text>
            </Pressable>
            <Pressable style={S.addButton} onPress={() => go("addMoney")}>
              <Text style={S.actionGreen}>＋ Add</Text>
            </Pressable>
          </View>
        </View>
        <View style={S.liveCard}>
          <Text style={S.rateCircle}>₿</Text>
          <View>
            <Text style={S.liveTitle}>Live Rate</Text>
            <Text style={S.liveValue}>1 NGN = 0.34 XOF</Text>
          </View>
          <Text style={S.livePill}>● LIVE</Text>
        </View>
        <View style={S.rowBetween}>
          <Text style={S.sectionTitle}>Recent Transactions</Text>
          <Pressable onPress={() => go("activity")}>
            <Text style={S.primaryText}>See all</Text>
          </Pressable>
        </View>
        {tx.map((x, i) => (
          <View style={S.tx} key={x[0]}>
            <View style={[S.txAvatar, i === 2 && S.txReceived]}>
              <Text style={S.initials}>
                {i === 0 ? "AB" : i === 1 ? "IB" : "A"}
              </Text>
            </View>
            <View style={S.txInfo}>
              <Text style={S.txName}>{x[0]}</Text>
              <Text style={S.txDesc}>{x[1]}</Text>
            </View>
            <View>
              <Text style={[S.txAmount, i === 2 && S.amountPositive]}>
                {x[2]}
              </Text>
              <Text style={S.txTime}>
                {i === 0
                  ? "Today, 10:45 AM"
                  : i === 1
                    ? "Yesterday"
                    : "Mon, 2:15 PM"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Shell>
  );
}
function Send({ go }: { go: (s: Screen) => void }) {
  const [amount, setAmount] = useState("100,000");
  return (
    <Shell active="send" go={go}>
      <ScrollView contentContainerStyle={S.appPage}>
        <AuthHeader title="Send Money" go={go} />
        <Text style={S.screenHeading}>Send Money</Text>
        <Text style={S.screenSub}>Real-time transfer at mid-market rates.</Text>
        <View style={S.conversion}>
          <Text style={S.upper}>YOU SEND</Text>
          <View style={S.amountRow}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={S.bigInput}
              keyboardType="numeric"
            />
            <View style={S.currencyPill}>
              <Image source={A.ng} style={S.smallFlag} />
              <Text>NGN ⌄</Text>
            </View>
          </View>
          <Text style={S.dash}>—</Text>
          <View style={S.swapCircle}>
            <Text style={S.swapArrows}>↕</Text>
          </View>
          <Text style={S.upper}>RECIPIENT RECEIVES</Text>
          <View style={S.amountRow}>
            <Text style={S.receivedAmount}>≈65,000</Text>
            <View style={S.currencyPill}>
              <Image source={A.ne} style={S.smallFlag} />
              <Text>XOF ⌄</Text>
            </View>
          </View>
        </View>
        <View style={S.feeCard}>
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>↗ Exchange Rate</Text>
            <Text style={S.feeValue}>1 NGN = 0.65 XOF</Text>
          </View>
          <View style={S.chart} />
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Transfer Fee</Text>
            <Text style={S.feeValue}>₦500.00</Text>
          </View>
          <View style={S.separator} />
          <View style={S.rowBetween}>
            <Text style={S.upper}>TOTAL YOU PAY</Text>
            <Text style={S.feeValue}>₦100,500</Text>
          </View>
        </View>
        <View style={S.protected}>
          <Text>♧</Text>
          <Text style={S.protectedText}>
            Your transfer is protected by bank-level encryption. The estimated
            arrival time is <Text style={S.bold}>under 5 minutes.</Text>
          </Text>
        </View>
        <Button title="Continue  →" onPress={() => go("recipient")} />
      </ScrollView>
    </Shell>
  );
}
function Recipient({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState(""),
    [bank, setBank] = useState(""),
    [rib, setRib] = useState(""),
    [phone, setPhone] = useState(""),
    [ref, setRef] = useState("");
  return (
    <View style={S.shell}>
      <ScrollView contentContainerStyle={S.appPage}>
        <Header title="Recipient Selection" onBack={() => go("send")} />
        <Text style={S.screenHeading}>Recipient Details</Text>
        <Text style={S.screenSub}>
          Enter the details of the person you are sending money to in Niger.
        </Text>
        <View style={S.destination}>
          <Image source={A.ne} style={S.destinationFlag} />
          <View style={S.destinationInfo}>
            <Text style={S.destinationTitle}>Sending to Niger</Text>
            <Text style={S.destinationSub}>Currency: CFA Franc (XOF)</Text>
          </View>
          <Text style={S.change}>Change</Text>
        </View>
        <Field
          label="Full Name as per Bank"
          value={name}
          setValue={setName}
          placeholder="e.g. Aïchatou Oumarou"
        />
        <Field
          label="Bank Name"
          value={bank}
          setValue={setBank}
          placeholder="Select Recipient's Bank"
        />
        <Field
          label="Account Number (RIB)"
          value={rib}
          setValue={setRib}
          placeholder="24-digit RIB number"
          keyboardType="numeric"
        />
        <Text style={S.helper}>
          Please ensure this matches the bank records exactly.
        </Text>
        <Field
          label="Recipient Phone Number (Optional)"
          value={phone}
          setValue={setPhone}
          placeholder="+227  Phone number"
          keyboardType="phone-pad"
        />
        <Text style={S.helper}>
          We&apos;ll send them an SMS when the transfer is complete.
        </Text>
        <Field
          label="Transfer Reference"
          value={ref}
          setValue={setRef}
          placeholder="e.g. Family Support, Business"
        />
        <View style={S.saveRow}>
          <View>
            <Text style={S.saveTitle}>Save this recipient</Text>
            <Text style={S.helper}>For faster transfers next time</Text>
          </View>
          <View style={S.toggle}>
            <View style={S.toggleKnob} />
          </View>
        </View>
        <Button title="Continue to Review  →" onPress={() => go("review")} />
      </ScrollView>
    </View>
  );
}
function Review({ go }: { go: (s: Screen) => void }) {
  return (
    <View style={S.shell}>
      <ScrollView contentContainerStyle={S.appPage}>
        <Header title="Confirmation" onBack={() => go("recipient")} />
        <View style={S.reviewHero}>
          <Text style={S.upperLight}>YOU ARE SENDING</Text>
          <Text style={S.reviewAmount}>₦100,000</Text>
          <Text style={S.reviewConversion}>NGN → 65,000 XOF</Text>
        </View>
        <View style={S.toCard}>
          <Text style={S.toLabel}>To</Text>
          <Text style={S.toName}>Abdoulaye Ibrahim</Text>
          <Text style={S.toBank}>Example Bank ••••1234</Text>
        </View>
        <View style={S.details}>
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Exchange Rate</Text>
            <Text style={S.feeValue}>1 NGN = 0.65 XOF</Text>
          </View>
          <View style={S.separator} />
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Fee</Text>
            <Text style={S.free}>Free</Text>
          </View>
          <View style={S.separator} />
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>◷ Delivery</Text>
            <Text style={S.feeValue}>Within minutes</Text>
          </View>
        </View>
        <View style={S.protected}>
          <Text>♧</Text>
          <Text style={S.protectedText}>
            Your transfer is protected by 256-bit encryption. Always ensure you
            know and trust the recipient before confirming.
          </Text>
        </View>
        <Button title="Confirm & Send  ▷" onPress={() => go("success")} />
      </ScrollView>
    </View>
  );
}
function Success({ go }: { go: (s: Screen) => void }) {
  return (
    <View style={S.shell}>
      <ScrollView contentContainerStyle={S.success}>
        <View style={S.successHeader}>
          <Header title="Transfer Details" onBack={() => go("review")} />
        </View>
        <Text style={S.successCircle}>✓</Text>
        <Text style={S.successTitle}>Transfer Successful</Text>
        <Text style={S.successSub}>Your funds are on the way.</Text>
        <View style={S.successCard}>
          <Text style={S.amountLabel}>Amount Sent</Text>
          <Text style={S.successAmount}>₦100,000</Text>
          <Text style={S.payout}>→ 65,000 XOF</Text>
          <View style={S.separator} />
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Recipient</Text>
            <Text style={S.feeValue}>Amina Diallo</Text>
          </View>
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Date & Time</Text>
            <Text style={S.feeValue}>Oct 24, 2023 • 14:32</Text>
          </View>
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Exchange Rate</Text>
            <Text style={S.feeValue}>1 NGN = 0.65 XOF</Text>
          </View>
          <View style={S.rowBetween}>
            <Text style={S.feeLabel}>Transaction ID</Text>
            <Text style={S.feeValue}>TXN-8842-99L</Text>
          </View>
        </View>
        <Button title="View Receipt" secondary onPress={() => go("activity")} />
        <Button title="Done" onPress={() => go("home")} />
      </ScrollView>
    </View>
  );
}
function Receipt({
  go,
  name = "Abdoulaye Diallo",
  amount = "₦15,000",
}: {
  go: (s: Screen) => void;
  name?: string;
  amount?: string;
}) {
  return (
    <View style={S.shell}>
      <ScrollView contentContainerStyle={S.receiptPage}>
        <Header title="Transaction Receipt" onBack={() => go("activity")} />
        <View style={S.receiptStatus}>
          <Text style={S.receiptCheck}>✓</Text>
          <Text style={S.receiptStatusTitle}>Payment completed</Text>
          <Text style={S.receiptStatusCopy}>
            Your transaction was processed successfully.
          </Text>
        </View>
        <View style={S.receiptCard}>
          <View style={S.receiptAccent} />
          <Text style={S.receiptAmountLabel}>Amount sent</Text>
          <Text style={S.receiptAmount}>{amount}</Text>
          <Text style={S.receiptCurrency}>NGN → XOF</Text>
          <View style={S.separator} />
          <View style={S.receiptRow}>
            <Text style={S.feeLabel}>Recipient</Text>
            <Text style={S.feeValue}>{name}</Text>
          </View>
          <View style={S.receiptRow}>
            <Text style={S.feeLabel}>Status</Text>
            <Text style={S.receiptPaid}>Completed</Text>
          </View>
          <View style={S.receiptRow}>
            <Text style={S.feeLabel}>Date & Time</Text>
            <Text style={S.feeValue}>Today, 10:45 AM</Text>
          </View>
          <View style={S.receiptRow}>
            <Text style={S.feeLabel}>Exchange Rate</Text>
            <Text style={S.feeValue}>1 NGN = 0.65 XOF</Text>
          </View>
          <View style={S.receiptRow}>
            <Text style={S.feeLabel}>Transaction ID</Text>
            <Text style={S.feeValue}>TXN-8842-99L</Text>
          </View>
        </View>
        <Button title="Done" onPress={() => go("activity")} />
      </ScrollView>
    </View>
  );
}
function AddMoney({ go }: { go: (s: Screen) => void }) {
  const [method, setMethod] = useState<"card" | "bank">("card");
  const [country, setCountry] = useState("Nigeria");
  const [amount, setAmount] = useState("");
  return (
    <View style={S.shell}>
      <ScrollView contentContainerStyle={S.addMoneyPage}>
        <Header title="Add Money" onBack={() => go("home")} />
        <Text style={S.screenHeading}>Fund your wallet</Text>
        <Text style={S.screenSub}>
          Add money securely from a bank card or account.
        </Text>
        <View style={S.addBalance}>
          <Text style={S.addBalanceLabel}>Current balance</Text>
          <Text style={S.addBalanceValue}>₦250,000.00</Text>
        </View>
        <Text style={S.section}>CHOOSE FUNDING METHOD</Text>
        <View style={S.methodRow}>
          <Pressable
            onPress={() => setMethod("card")}
            style={[S.methodCard, method === "card" && S.methodSelected]}
          >
            <Text style={S.methodIcon}>▣</Text>
            <Text style={S.methodTitle}>Bank card</Text>
            <Text style={S.methodCopy}>Debit or credit card</Text>
          </Pressable>
          <Pressable
            onPress={() => setMethod("bank")}
            style={[S.methodCard, method === "bank" && S.methodSelected]}
          >
            <Text style={S.methodIcon}>▤</Text>
            <Text style={S.methodTitle}>Bank account</Text>
            <Text style={S.methodCopy}>Transfer from your bank</Text>
          </Pressable>
        </View>
        <Field
          label="Amount to add"
          value={amount}
          setValue={setAmount}
          placeholder="₦ 0.00"
          keyboardType="numeric"
        />
        <CountryPicker
          label="Funding country"
          value={country}
          onChange={(item) => setCountry(item.name)}
        />
        {method === "card" ? (
          <>
            <Field
              label="Card number"
              value=""
              setValue={() => {}}
              placeholder="1234  5678  9012  3456"
              keyboardType="numeric"
            />
            <View style={S.formRow}>
              <View style={S.formHalf}>
                <Field
                  label="Expiry date"
                  value=""
                  setValue={() => {}}
                  placeholder="MM / YY"
                />
              </View>
              <View style={S.formHalf}>
                <Field
                  label="CVV"
                  value=""
                  setValue={() => {}}
                  placeholder="•••"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <Field
              label="Account holder name"
              value=""
              setValue={() => {}}
              placeholder="Name on bank account"
            />
            <Field
              label="Bank account number"
              value=""
              setValue={() => {}}
              placeholder="10-digit account number"
              keyboardType="numeric"
            />
          </>
        )}
        <View style={S.protected}>
          <Text>♧</Text>
          <Text style={S.protectedText}>
            Your payment details are encrypted and never stored on this device.
          </Text>
        </View>
        <Button title="Continue to payment  →" onPress={() => go("home")} />
      </ScrollView>
    </View>
  );
}
function Activity({ go }: { go: (s: Screen) => void }) {
  return (
    <Shell active="activity" go={go}>
      <ScrollView contentContainerStyle={S.appPage}>
        <AuthHeader title="Activity" go={go} />
        <Text style={S.title}>Transactions</Text>
        <Text style={S.screenSub}>Your recent activity</Text>
        {[
          "Abdoulaye Diallo · -₦15,000",
          "Ibrahim Traoré · -₦42,500",
          "Aisha Bello · +₦8,200",
          "Moussa Abdou · -₦30,000",
        ].map((t, i) => (
          <Pressable
            style={S.tx}
            key={t}
            onPress={() => go("receipt")}
            accessibilityLabel={`Open receipt for ${t.split(" Â· ")[0]}`}
          >
            <View style={[S.txAvatar, i === 2 && S.txReceived]}>
              <Text style={S.initials}>
                {i === 0 ? "AB" : i === 1 ? "IB" : i === 2 ? "A" : "MA"}
              </Text>
            </View>
            <View style={S.txInfo}>
              <Text style={S.txName}>{t.split(" · ")[0]}</Text>
              <Text style={S.txDesc}>Completed · Today</Text>
            </View>
            <Text style={[S.txAmount, i === 2 && S.amountPositive]}>
              {t.split(" · ")[1]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Shell>
  );
}
function Profile({ go }: { go: (s: Screen) => void }) {
  return (
    <Shell active="profile" go={go}>
      <ScrollView contentContainerStyle={S.appPage}>
        <AuthHeader title="Profile" go={go} />
        <View style={S.profileTop}>
          <Image source={A.profile} style={S.profileImage} />
          <Text style={S.profileName}>Jeremiah Ehigocho</Text>
          <Text style={S.profileEmail}>jeremiah.e@example.com</Text>
          <Text style={S.profilePhone}>+234 801 234 5678</Text>
          <Text style={S.tier}>TIER 3 VERIFIED</Text>
        </View>
        {[
          [
            "ACCOUNT",
            [
              "Personal Info",
              "KYC & Limits",
              "Linked Banks",
              "Saved Recipients",
            ],
          ],
          ["SECURITY", ["Change PIN", "Change Password", "Biometric Login"]],
          ["SUPPORT", ["Help Center", "Contact Support", "Report an Issue"]],
          ["LEGAL", ["Terms & Conditions", "Privacy Policy"]],
        ].map(([heading, items]) => (
          <View key={heading as string}>
            <Text style={S.section}>{heading as string}</Text>
            <View style={S.settings}>
              {(items as string[]).map((x) => (
                <Pressable style={S.setting} key={x}>
                  <Text style={S.settingText}>{x}</Text>
                  <Text style={S.chevron}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <Text style={S.version}>App Version 2.4.1 (Build 492)</Text>
        <Button title="⇥  Log Out" secondary onPress={() => go("welcome")} />
      </ScrollView>
    </Shell>
  );
}
function PersonalInfo({ go }: { go: (s: Screen) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [avatar, setAvatar] = useState("🌍");
  const avatars = ["🌍", "🦁", "🌺", "🌞", "🦋", "⭐"];
  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };
  return (
    <ScrollView contentContainerStyle={S.personalPage}>
      <Header title="Personal Information" onBack={() => go("home")} />
      <View style={S.personalHero}>
        {photo ? (
          <Image source={{ uri: photo }} style={S.personalPhoto} />
        ) : (
          <View style={S.avatarIllustration}>
            <Text style={S.avatarIllustrationText}>{avatar}</Text>
          </View>
        )}
        <Pressable style={S.photoButton} onPress={choosePhoto}>
          <Text style={S.photoButtonText}>Add profile photo</Text>
        </Pressable>
        <Text style={S.photoHint}>
          Choose a photo or use a profile illustration
        </Text>
      </View>
      <Text style={S.section}>PROFILE ILLUSTRATIONS</Text>
      <View style={S.avatarGrid}>
        {avatars.map((item) => (
          <Pressable
            key={item}
            onPress={() => {
              setAvatar(item);
              setPhoto(null);
            }}
            style={[
              S.avatarChoice,
              avatar === item && !photo && S.avatarChoiceSelected,
            ]}
          >
            <Text style={S.avatarChoiceText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={S.section}>YOUR DETAILS</Text>
      <Field
        label="Full Name"
        value="Jeremiah Ehigocho"
        setValue={() => {}}
        placeholder="Full Name"
      />
      <Field
        label="Email Address"
        value="jeremiah.e@example.com"
        setValue={() => {}}
        placeholder="Email Address"
      />
      <Field
        label="Phone Number"
        value="+234 801 234 5678"
        setValue={() => {}}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <Button title="Save Changes" onPress={() => go("profile")} />
    </ScrollView>
  );
}
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const go = (s: Screen) => setScreen(s);
  let content: React.ReactNode;
  if (screen === "splash") content = <Splash go={() => go("welcome")} />;
  else if (screen === "welcome") content = <Welcome go={go} />;
  else if (screen === "create") content = <Create go={go} />;
  else if (screen === "otp") content = <VerifyExact kind="otp" go={go} />;
  else if (screen === "kyc") content = <KycExact go={go} />;
  else if (screen === "pin") content = <PinExact go={go} />;
  else if (screen === "login") content = <Login go={go} />;
  else if (screen === "home") content = <Home go={go} />;
  else if (screen === "send") content = <Send go={go} />;
  else if (screen === "recipient") content = <Recipient go={go} />;
  else if (screen === "review") content = <Review go={go} />;
  else if (screen === "success") content = <Success go={go} />;
  else if (screen === "activity") content = <Activity go={go} />;
  else if (screen === "profile") content = <Profile go={go} />;
  else if (screen === "personal") content = <PersonalInfo go={go} />;
  else if (screen === "receipt") content = <Receipt go={go} />;
  else content = <AddMoney go={go} />;
  return (
    <SafeAreaView style={S.safe}>
      <StatusBar style="dark" />
      {content}
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  pinPage: { padding: 20, flexGrow: 1 },
  pinTop: { height: 42 },
  pinHero: { alignItems: "center", paddingTop: 22, paddingBottom: 30 },
  pinIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.primary2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  pinLogo: { width: 64, height: 64, borderRadius: 32 },
  pinTitle: {
    color: C.ink,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  pinCopy: {
    color: C.variant,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 280,
    marginTop: 8,
  },
  pinGroup: { alignItems: "center", marginBottom: 22 },
  pinDisabled: { opacity: 0.5 },
  pinLabel: { color: C.ink, fontSize: 14, fontWeight: "600", marginBottom: 12 },
  pinBoxes: { flexDirection: "row", gap: 10 },
  pinBox: {
    width: 56,
    height: 64,
    borderRadius: 8,
    backgroundColor: C.pale,
    textAlign: "center",
    fontSize: 28,
    color: C.ink,
    elevation: 2,
  },
  pinHint: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.pale2,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 3,
  },
  pinHintIcon: { color: C.primary, fontSize: 20 },
  pinHintText: { color: C.variant, fontSize: 12 },
  kycPage: { padding: 20, flexGrow: 1 },
  documentHelp: {
    color: C.variant,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  documentTypes: { flexDirection: "row", gap: 12, marginBottom: 14 },
  documentType: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    gap: 7,
    elevation: 1,
  },
  documentSelected: { backgroundColor: C.primary2 },
  documentIcon: { fontSize: 25, color: C.primary },
  documentText: { color: C.ink, fontSize: 13 },
  documentSelectedText: { color: C.green, fontSize: 13 },
  documentUpload: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#bfc9bf",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginBottom: 4,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateValue: { color: C.ink, fontSize: 16 },
  datePlaceholder: { color: "#98a2b3", fontSize: 16 },
  calendarIcon: { color: C.primary, fontSize: 20 },
  dateHint: { color: C.muted, fontSize: 12, marginTop: 7 },
  modalShade: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(19,27,46,0.42)",
  },
  dateModal: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalEyebrow: {
    color: C.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  modalTitle: { color: C.ink, fontSize: 23, fontWeight: "700", marginTop: 6 },
  modalClose: { color: C.variant, fontSize: 30, lineHeight: 30 },
  modalCopy: { color: C.variant, fontSize: 14, marginTop: 8, marginBottom: 22 },
  dateColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  dateColumn: { alignItems: "center", width: "30%" },
  dateColumnLabel: {
    color: C.variant,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  dateArrow: { color: C.primary, fontSize: 14, padding: 5 },
  dateSelected: {
    color: C.ink,
    fontSize: 24,
    fontWeight: "700",
    paddingVertical: 7,
  },
  verifyPage: { flexGrow: 1, padding: 24 },
  verifyBack: {
    width: 42,
    height: 42,
    justifyContent: "center",
    marginBottom: 30,
  },
  verifyCopy: {
    color: C.variant,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  otpRow: { flexDirection: "row", gap: 8, marginBottom: 28 },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 8,
    backgroundColor: C.pale,
    textAlign: "center",
    fontSize: 24,
    color: C.ink,
    elevation: 2,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 22,
  },
  resendLabel: { color: C.variant, fontSize: 14 },
  resendLink: { color: C.primary, fontSize: 14, fontWeight: "600" },
  disabled: { opacity: 0.5 },
  createBack: {
    width: 42,
    height: 42,
    justifyContent: "center",
    marginBottom: 12,
  },
  createBackGlyph: { color: C.ink, fontSize: 40, lineHeight: 40 },
  createPage: { padding: 20, flexGrow: 1 },
  phoneRow: { flexDirection: "row", height: 55 },
  prefix: {
    backgroundColor: "#e2e7ff",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prefixText: { color: C.ink, fontSize: 16 },
  prefixArrow: { color: C.muted, fontSize: 18 },
  phoneInput: {
    flex: 1,
    backgroundColor: C.pale2,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    color: C.ink,
    fontSize: 16,
  },
  passwordRow: {
    height: 55,
    borderRadius: 12,
    backgroundColor: C.pale2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  passwordIcon: { color: C.muted, fontSize: 13, marginRight: 12 },
  passwordInput: { flex: 1, color: C.ink, fontSize: 16 },
  eye: { color: C.muted, fontSize: 22 },
  strengthRow: { flexDirection: "row", gap: 4, marginTop: 10 },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  strengthInactive: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: C.border,
  },
  strengthText: { color: C.muted, fontSize: 12, marginTop: 8 },
  createSpacer: { height: 22 },
  trust: {
    backgroundColor: C.pale,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  trustIcon: { color: C.primary, fontSize: 23 },
  trustText: { flex: 1, color: C.variant, fontSize: 12, lineHeight: 17 },
  loginFooter: {
    color: C.variant,
    textAlign: "center",
    fontSize: 14,
    marginTop: 18,
  },
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  shell: { flex: 1, backgroundColor: C.bg },
  splash: {
    flex: 1,
    backgroundColor: C.primary2,
    alignItems: "center",
    justifyContent: "center",
  },
  splashCard: {
    width: 220,
    height: 220,
    borderRadius: 30,
    backgroundColor: C.white,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  splashName: { color: C.white, fontSize: 31, marginTop: 22 },
  splashTag: { color: C.green, fontSize: 18, fontWeight: "600", marginTop: 18 },
  splashDot: {
    position: "absolute",
    bottom: 72,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.green,
  },
  logoWrap: { alignItems: "center", justifyContent: "center" },
  logoLarge: { width: 165, height: 165 },
  brand: { flexDirection: "row", alignItems: "center", gap: 7 },
  logoHeader: { width: 34, height: 34, borderRadius: 17 },
  brandName: { color: C.primary, fontSize: 20 },
  welcome: { flexGrow: 1, padding: 24, justifyContent: "space-between" },
  hero: { alignItems: "center", paddingTop: 44 },
  welcomeLogo: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 7,
    elevation: 3,
    shadowColor: C.ink,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  display: {
    fontSize: 31,
    lineHeight: 40,
    color: C.ink,
    textAlign: "center",
    fontWeight: "700",
    marginTop: 34,
  },
  primaryText: { color: C.primary },
  underline: {
    height: 4,
    width: 208,
    backgroundColor: "#8e4f00",
    borderRadius: 4,
    marginTop: 5,
  },
  heroCopy: {
    color: C.variant,
    fontSize: 19,
    lineHeight: 31,
    textAlign: "center",
    marginTop: 24,
  },
  currencySwitch: {
    width: "100%",
    height: 94,
    borderRadius: 50,
    backgroundColor: C.pale2,
    marginTop: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  currencySelected: {
    backgroundColor: C.white,
    borderRadius: 40,
    paddingVertical: 17,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 2,
  },
  currencySide: { flexDirection: "row", alignItems: "center", gap: 12 },
  flag: { width: 35, height: 35, borderRadius: 18 },
  swap: { color: C.variant, fontSize: 25 },
  currencyText: { fontSize: 22, color: C.ink },
  button: {
    width: "100%",
    height: 62,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: C.pale2,
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  buttonText: { color: C.white, fontSize: 18, fontWeight: "600" },
  secondaryText: { color: C.primary },
  pressed: { opacity: 0.75 },
  already: {
    color: C.primary,
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 22,
  },
  page: { padding: 24, flexGrow: 1 },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  back: { width: 38, height: 38, justifyContent: "center" },
  backGlyph: { fontSize: 40, color: C.ink, lineHeight: 38 },
  headerTitle: {
    color: C.ink,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  title: {
    color: C.ink,
    fontSize: 29,
    lineHeight: 38,
    fontWeight: "700",
    marginBottom: 10,
  },
  copy: { color: C.variant, fontSize: 16, lineHeight: 24, marginBottom: 24 },
  field: { marginBottom: 17 },
  label: { color: C.variant, fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    backgroundColor: C.white,
    paddingHorizontal: 16,
    color: C.ink,
    fontSize: 16,
  },
  terms: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 12,
  },
  center: { alignItems: "center" },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  otpLogo: { width: 74, height: 74, borderRadius: 37 },
  icon: { display: "none" },
  otp: {
    width: "100%",
    height: 62,
    borderWidth: 2,
    borderColor: C.primary,
    borderRadius: 12,
    backgroundColor: C.white,
    textAlign: "center",
    fontSize: 27,
    letterSpacing: 12,
    color: C.ink,
  },
  resend: { color: C.muted, fontSize: 14, textAlign: "center", marginTop: 22 },
  section: {
    color: C.primary,
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 12,
  },
  upload: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: C.primary,
    borderRadius: 16,
    backgroundColor: "#f4faf6",
    padding: 25,
    alignItems: "center",
  },
  uploadIcon: { fontSize: 34, color: C.primary },
  uploadTitle: { fontSize: 16, fontWeight: "700", color: C.ink, marginTop: 8 },
  uploadCopy: { fontSize: 13, color: C.muted, marginTop: 5 },
  security: {
    backgroundColor: "#fff8ed",
    padding: 16,
    borderRadius: 14,
    marginVertical: 18,
  },
  securityTitle: { color: C.ink, fontWeight: "700" },
  securityCopy: { color: C.muted, lineHeight: 20, marginTop: 6 },
  forgot: { color: C.primary, fontWeight: "600", marginTop: -5 },
  receiptPage: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  receiptStatus: { alignItems: "center", marginVertical: 12 },
  receiptCheck: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: C.primary,
    color: C.white,
    textAlign: "center",
    lineHeight: 68,
    fontSize: 34,
  },
  receiptStatusTitle: {
    color: C.ink,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 14,
  },
  receiptStatusCopy: { color: C.variant, fontSize: 14, marginTop: 6 },
  receiptCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 22,
    marginTop: 20,
    overflow: "hidden",
    elevation: 2,
  },
  receiptAccent: {
    height: 4,
    backgroundColor: C.primary,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  receiptAmountLabel: {
    color: C.variant,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  receiptAmount: {
    color: C.ink,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 7,
  },
  receiptCurrency: {
    color: C.primary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  receiptPaid: {
    color: C.primary,
    backgroundColor: "#e7f7ed",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "700",
  },
  addMoneyPage: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  addBalance: {
    backgroundColor: C.primary,
    borderRadius: 18,
    padding: 20,
    marginTop: 4,
  },
  addBalanceLabel: { color: C.green, fontSize: 13 },
  addBalanceValue: {
    color: C.white,
    fontSize: 25,
    fontWeight: "700",
    marginTop: 10,
  },
  methodRow: { flexDirection: "row", gap: 12, marginBottom: 5 },
  methodCard: {
    flex: 1,
    minHeight: 112,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
  },
  methodSelected: { borderColor: C.primary, backgroundColor: "#eefaf2" },
  methodIcon: { color: C.primary, fontSize: 22 },
  methodTitle: { color: C.ink, fontSize: 14, fontWeight: "700", marginTop: 9 },
  methodCopy: { color: C.muted, fontSize: 11, marginTop: 4 },
  formRow: { flexDirection: "row", gap: 12 },
  formHalf: { flex: 1 },
  appPage: { padding: 20, paddingBottom: 34 },
  appHeader: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  authHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  authBack: { width: 40, height: 40, justifyContent: "center" },
  authBackGlyph: { color: C.ink, fontSize: 40, lineHeight: 40 },
  authTitle: {
    flex: 1,
    color: C.ink,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4,
  },
  authLogo: { width: 38, height: 38, borderRadius: 19 },
  dashboardHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dashboardBrandLogo: { width: 42, height: 42, borderRadius: 21 },
  dashboardProfile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: C.green,
  },
  personalPage: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  personalHero: { alignItems: "center", marginBottom: 24 },
  personalPhoto: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: C.green,
  },
  avatarIllustration: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: C.green,
  },
  avatarIllustrationText: { fontSize: 52 },
  photoButton: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: C.primary,
  },
  photoButtonText: { color: C.white, fontSize: 14, fontWeight: "700" },
  photoHint: { color: C.muted, fontSize: 12, marginTop: 8 },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  avatarChoice: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.pale2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarChoiceSelected: { borderColor: C.primary, backgroundColor: C.green },
  avatarChoiceText: { fontSize: 28 },
  countryInput: { flexDirection: "row", alignItems: "center" },
  countryFlag: { width: 26, height: 18, borderRadius: 3, marginRight: 10 },
  countryValue: { flex: 1, color: C.ink, fontSize: 16 },
  countryChevron: { color: C.primary, fontSize: 22 },
  countryModal: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 30,
  },
  countryOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: C.white,
  },
  countryOptionSelected: { backgroundColor: C.pale },
  countryFlagLarge: { width: 42, height: 28, borderRadius: 4, marginRight: 14 },
  countryOptionText: { flex: 1 },
  countryName: { color: C.ink, fontSize: 16, fontWeight: "600" },
  countryCode: { color: C.variant, fontSize: 13, marginTop: 3 },
  countryCheck: { color: C.primary, fontSize: 22, fontWeight: "700" },
  homeLabel: {
    color: C.variant,
    fontSize: 16,
    letterSpacing: 2,
    marginLeft: "auto",
    marginRight: 18,
  },
  avatar: { width: 58, height: 58, borderRadius: 29 },
  greeting: { color: C.ink, fontSize: 28 },
  greetingSub: {
    color: C.variant,
    fontSize: 21,
    marginTop: 6,
    marginBottom: 22,
  },
  balance: {
    backgroundColor: C.primary,
    borderRadius: 22,
    padding: 24,
    marginBottom: 18,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: { color: C.green, fontSize: 20 },
  balanceAmount: { color: C.white, fontSize: 31, marginTop: 25 },
  balanceXof: { color: "#8dd6a6", fontSize: 22, marginTop: 7 },
  balanceButtons: { flexDirection: "row", gap: 14, marginTop: 24 },
  sendButton: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: C.coral,
    padding: 18,
    alignItems: "center",
  },
  addButton: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: "#dbe2ff",
    padding: 18,
    alignItems: "center",
  },
  actionWhite: { color: C.white, fontSize: 19 },
  actionGreen: { color: C.primary, fontSize: 19 },
  liveCard: {
    backgroundColor: C.pale,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 34,
  },
  rateCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: C.white,
    textAlign: "center",
    lineHeight: 43,
    color: C.primary,
    fontSize: 22,
  },
  liveTitle: { color: C.variant, fontSize: 18 },
  liveValue: { color: C.ink, fontSize: 22, marginTop: 4 },
  livePill: {
    marginLeft: "auto",
    color: C.primary,
    backgroundColor: "#d7e9df",
    padding: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: { color: C.ink, fontSize: 21, marginBottom: 8 },
  tx: {
    backgroundColor: C.pale2,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  txAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1dfe2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  txReceived: { backgroundColor: "#e7f2ec" },
  initials: { color: C.red, fontSize: 16 },
  txInfo: { flex: 1 },
  txName: { color: C.ink, fontSize: 17 },
  txDesc: { color: C.variant, fontSize: 15, marginTop: 5 },
  txAmount: { color: C.ink, fontSize: 17, fontWeight: "600" },
  amountPositive: { color: C.primary },
  txTime: { color: C.variant, fontSize: 11, textAlign: "right", marginTop: 6 },
  nav: {
    height: 80,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    paddingTop: 8,
  },
  navItem: { flex: 1, alignItems: "center" },
  navIcon: { fontSize: 25, color: C.variant, height: 31 },
  navLabel: { fontSize: 13, color: C.variant },
  active: { color: C.primary },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.primary,
    marginTop: 3,
  },
  screenHeading: { color: C.ink, fontSize: 25, marginBottom: 8 },
  screenSub: { color: C.variant, fontSize: 18, marginBottom: 25 },
  conversion: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 36,
    marginBottom: 18,
  },
  upper: { color: C.variant, fontSize: 17, letterSpacing: 2 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  bigInput: { fontSize: 25, color: C.ink, flex: 1 },
  currencyPill: {
    backgroundColor: C.pale,
    borderRadius: 28,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    fontSize: 17,
  },
  smallFlag: { width: 24, height: 24, borderRadius: 12 },
  dash: { color: C.primary, fontSize: 30 },
  swapCircle: {
    alignSelf: "center",
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  swapArrows: { color: C.green, fontSize: 30 },
  receivedAmount: { color: C.primary, fontSize: 24 },
  feeCard: { backgroundColor: C.pale2, borderRadius: 18, padding: 22 },
  feeLabel: { color: C.variant, fontSize: 18 },
  feeValue: { color: C.ink, fontSize: 17 },
  chart: {
    height: 36,
    borderBottomWidth: 2,
    borderBottomColor: "#8aaea0",
    marginVertical: 16,
  },
  separator: { height: 1, backgroundColor: C.border, marginVertical: 19 },
  protected: {
    backgroundColor: "#dbe5ff",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
  },
  protectedText: { flex: 1, color: C.variant, fontSize: 16, lineHeight: 25 },
  bold: { fontWeight: "800", color: C.ink },
  destination: {
    backgroundColor: C.pale,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  destinationFlag: { width: 54, height: 54, borderRadius: 27 },
  destinationInfo: { flex: 1, marginLeft: 14 },
  destinationTitle: { fontSize: 18, color: C.ink },
  destinationSub: { fontSize: 14, color: C.variant, marginTop: 5 },
  change: {
    backgroundColor: "#d4dfef",
    color: C.primary,
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  helper: { color: C.variant, fontSize: 12, marginTop: -10, marginBottom: 16 },
  saveRow: {
    borderWidth: 1,
    borderColor: "#bfc9bf",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  saveTitle: { fontSize: 18, color: C.ink },
  toggle: {
    width: 62,
    height: 34,
    borderRadius: 20,
    backgroundColor: C.primary,
    padding: 3,
    justifyContent: "center",
  },
  toggleKnob: {
    alignSelf: "flex-end",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.white,
  },
  reviewHero: {
    backgroundColor: C.primary,
    borderRadius: 34,
    padding: 38,
    alignItems: "center",
  },
  upperLight: { color: C.green, fontSize: 17, letterSpacing: 2 },
  reviewAmount: { color: C.white, fontSize: 30, marginVertical: 14 },
  reviewConversion: { color: C.green, fontSize: 23 },
  toCard: {
    backgroundColor: C.pale,
    borderRadius: 25,
    padding: 38,
    marginTop: 38,
  },
  toLabel: { color: C.variant, fontSize: 16 },
  toName: { color: C.ink, fontSize: 25, fontWeight: "700", marginTop: 14 },
  toBank: { color: C.variant, fontSize: 18, marginTop: 7 },
  details: {
    backgroundColor: C.white,
    borderRadius: 25,
    padding: 26,
    marginTop: 38,
  },
  free: {
    color: C.primary,
    backgroundColor: "#e7f7ed",
    padding: 10,
    borderRadius: 22,
    fontSize: 17,
  },
  success: {
    padding: 20,
    paddingTop: 0,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  successHeader: { width: "100%", alignSelf: "stretch" },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primary,
    color: C.white,
    textAlign: "center",
    lineHeight: 80,
    fontSize: 36,
    marginTop: 18,
    marginBottom: 18,
  },
  successTitle: { color: C.ink, fontSize: 24, fontWeight: "700" },
  successSub: { color: C.variant, fontSize: 16, marginTop: 8 },
  successCard: {
    width: "100%",
    backgroundColor: C.white,
    borderRadius: 22,
    borderTopWidth: 5,
    borderTopColor: C.primary,
    padding: 24,
    marginVertical: 24,
    gap: 12,
  },
  amountLabel: { color: C.variant, fontSize: 18 },
  successAmount: { color: C.ink, fontSize: 28, marginTop: 5 },
  payout: {
    color: C.primary,
    backgroundColor: "#e7f2ec",
    padding: 12,
    borderRadius: 25,
    fontSize: 20,
  },
  profileTop: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 128, height: 128, borderRadius: 64 },
  profileName: { color: C.ink, fontSize: 18, marginTop: 14 },
  profileEmail: { color: C.variant, marginTop: 7 },
  profilePhone: { color: C.variant, marginTop: 5 },
  tier: {
    backgroundColor: C.primary,
    color: C.green,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    marginTop: 14,
    fontSize: 12,
    letterSpacing: 1,
  },
  settings: {
    backgroundColor: C.pale,
    borderRadius: 12,
    marginBottom: 17,
    paddingHorizontal: 14,
  },
  setting: {
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingText: { color: C.ink, fontSize: 15 },
  chevron: { color: C.ink, fontSize: 24 },
  version: { textAlign: "center", color: C.variant, marginBottom: 18 },
});
