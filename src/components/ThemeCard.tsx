import React from 'react';
interface ThemeColors {
  bg_primary: string;
  bg_secondary: string;
  bg_tertiary: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  accent: string;
  accent_secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}
interface ThemeCardProps {
  name: string;
  colors: ThemeColors;
}
export function ThemeCard({
  name,
  colors
}: ThemeCardProps) {
  return <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-cyan-500/50 transition-all">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-white mb-2">{name}</h4>
      </div>
      {/* Background colors */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Background</div>
        <div className="flex gap-1">
          <div className="w-8 h-8 rounded border border-gray-600" style={{
          backgroundColor: colors.bg_primary
        }} title="Primary" />
          <div className="w-8 h-8 rounded border border-gray-600" style={{
          backgroundColor: colors.bg_secondary
        }} title="Secondary" />
          <div className="w-8 h-8 rounded border border-gray-600" style={{
          backgroundColor: colors.bg_tertiary
        }} title="Tertiary" />
        </div>
      </div>
      {/* Accent colors */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Accents</div>
        <div className="flex gap-1">
          <div className="w-8 h-8 rounded border border-gray-600" style={{
          backgroundColor: colors.accent
        }} title="Accent" />
          <div className="w-8 h-8 rounded border border-gray-600" style={{
          backgroundColor: colors.accent_secondary
        }} title="Accent Secondary" />
        </div>
      </div>
      {/* Status colors */}
      <div>
        <div className="text-xs text-gray-400 mb-1">Status</div>
        <div className="flex gap-1">
          <div className="w-6 h-6 rounded border border-gray-600" style={{
          backgroundColor: colors.success
        }} title="Success" />
          <div className="w-6 h-6 rounded border border-gray-600" style={{
          backgroundColor: colors.warning
        }} title="Warning" />
          <div className="w-6 h-6 rounded border border-gray-600" style={{
          backgroundColor: colors.danger
        }} title="Danger" />
          <div className="w-6 h-6 rounded border border-gray-600" style={{
          backgroundColor: colors.info
        }} title="Info" />
        </div>
      </div>
    </div>;
}