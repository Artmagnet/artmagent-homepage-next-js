import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      /** 🌟 스타일 관련 규칙 */
      "indent": ["error", 2], // ✅ 들여쓰기 2칸
      "quotes": ["error", "double"], // ✅ 큰따옴표 사용 `"text"`
      "semi": ["error", "always"], // ✅ 세미콜론 항상 사용
      "no-trailing-spaces": "error", // ✅ 불필요한 공백 제거
      "eol-last": ["error", "always"], // ✅ 마지막 줄 개행 유지
      "no-mixed-spaces-and-tabs": "error", // ✅ 스페이스 & 탭 혼용 금지
      "object-curly-spacing": ["error", "always"], // ✅ 객체 `{ key: value }` 중괄호 공백 유지

      /** 🌟 코드 품질 & 베스트 프랙티스 */
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // ⚠️ 사용하지 않는 변수 경고 (앞에 `_` 붙이면 예외)
      "no-console": "warn", // ⚠️ console.log() 사용 시 경고
      "no-debugger": "error", // 🚨 debugger 사용 금지
      "eqeqeq": ["error", "always"], // ✅ `==` 대신 `===` 사용 강제
      "curly": ["error", "all"], // ✅ if, for, while에서 중괄호 `{}` 항상 사용

      /** 🌟 React 관련 규칙 */
      "react/react-in-jsx-scope": "off", // ✅ Next.js 사용 시 필요 없음
      "react/jsx-uses-react": "off", // ✅ Next.js + React 17 이상 사용 시 필요 없음
      "react-hooks/rules-of-hooks": "error", // ✅ Hooks 사용 규칙 준수
      "react-hooks/exhaustive-deps": "warn", // ⚠️ useEffect 의존성 배열 체크 경고
    },
  },
];

export default eslintConfig;
