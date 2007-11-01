#!/bin/sh
#
# SuspendQuirks, copyright Richard Hughes 2007
# created  : 29-07-2007
# modified : 29-07-2007

# updated: 2007-08-04 Thomas Perl <thp at perli.net>
# Added support for Debian distro, fix for xorg.conf commented-out drivers

supported_distro=""
unload_modules=""
quirks=""
arch="`uname -i`"

abort ()
{
	echo "CRITICAL ERROR: $1"
	exit 1
}

warn ()
{
	echo "WARNING: $1"
}

add_quirk ()
{
	quirks="$quirks\npm-suspend $1"
}

add_module ()
{
	if [ -z "$unload_modules" ]; then
		unload_modules="$1"
	else
		unload_modules="$1 $unload_modules"
	fi
}


echo -e "Checking your system...\n"

#find distro
if [ -e /etc/redhat-release ]; then
	supported_distro="redhat"
fi
if [ -e /etc/mandriva-release ]; then
	supported_distro="mandriva"
fi
if [ -e /etc/debian_version ]; then
        supported_distro="debian"
fi

#check distro
if [ -z "$supported_distro" ]; then
	abort "No supported distro"
fi

#check quirks are installed
if [ -z "`lshal | grep quirk`" ]; then
	warn "You have no quirks!"
	#IBM
	if [ "`hal-get-property --udi /org/freedesktop/Hal/devices/computer --key system.hardware.vendor`" = "IBM" ]; then
		add_quirk "--quirk-s3-bios --quirk-s3-mode"
	fi
	#LENOVO
	if [ "`hal-get-property --udi /org/freedesktop/Hal/devices/computer --key system.hardware.vendor`" = "LENOVO" ]; then
		add_quirk "--quirk-s3-bios --quirk-s3-mode"
	fi
	#Intel
	if [ -n "`cat /etc/X11/xorg.conf | grep intel`" ]; then
		add_quirk "--quirk-vbemode-restore"
		add_quirk "--quirk-vbe-post"
	fi
fi

#check kernel capabilities
if [ -n "`uname -r | grep 3194`" ]; then
	abort "Do not use the default Fedora GOLD kernel. It's broken. Use a kernel from updates!"
fi
if [ -n "`uname -r | grep xen`" ]; then
	abort "Do not use a XEN kernel. It will not suspend!"
fi

#check kernel capabilities
if [ -z "`cat /sys/power/state | grep mem`" ]; then
	abort "Kernel does not support suspend!"
fi
if [ -z "`cat /sys/power/state | grep disk`" ]; then
	warn "Kernel does not support hibernate!"
fi

#check pm-utils is correct arch
if [ $arch = "i386" ]; then
	if [ -n "`rpm -q pm-utils | grep athlon`" ]; then
		abort "pm-utils is the wrong arch!"
	fi
fi

#check HAL has got the right value
if [ "hal-get-property --udi /org/freedesktop/Hal/devices/computer --key power_management.can_suspend" = "false" ]; then
	abort "HAL does not detect suspend!"
fi

#check for no consolekit in GNOME
if [ -n "`ps aux | grep gnome-session | grep -v grep`" ]; then
	if [ -z "`ps aux | grep console-kit-daemon | grep -v grep`" ];then
		abort "ConsoleKit is not running. Suggest 'chkconfig ConsoleKit on' and reboot" 
	fi
fi

#check for nvidia binary graphics
if [ -n "`cat /etc/X11/xorg.conf | grep '^\s*[^#]*nvidia'`" ]; then
	abort "Using nvidia binary driver. This is not supported!"
fi

#check for ati binary graphics
if [ -n "`cat /etc/X11/xorg.conf | grep '^\s*[^#]*fglrx'`" ]; then
	abort "Using ATI binary driver. This is not supported!"
fi

#check for old intel graphics
if [ -n "`cat /etc/X11/xorg.conf | grep '^\s*[^#]*i810'`" ]; then
	abort "Using old 'i810' non-modesetting intel driver. Try using 'intel' driver!"
fi

#check for broadcom networking
if [ -n "`/sbin/lsmod | grep b44`" ]; then
	add_module "b44"
	warn "Using broadcom network driver."
fi

#check for ndiswrapper
if [ -n "`/sbin/lsmod | grep ndiswrapper`" ]; then
	add_module "ndiswrapper"
	warn "Using ndiswrapper network driver."
fi

#check for 915resolution
if [ -e /usr/bin/915resolution ]; then
	warn "Do not use 915resolution with the new intel driver!"
fi

#check for suspend
if [ -e /usr/bin/suspend ]; then
	abort "Do not use suspend2, it's unsupported!"
fi

#check for old intel networking
if [ -n "`ps aux | grep ipw3945 | grep -v grep`" ]; then
	abort "Use the mac80211 based iwl3945 driver instead. ipw3945d is closed source sometimes hangs on resume."
fi

#check for iwl3945
if [ -n "`/sbin/lsmod | grep iwl3945`" ]; then
	add_module "iwl3945"
	warn "iwl3945 is usually okay for suspend - but it might be worth trying unloading it."
fi

#check for kvm
if [ -n "`/sbin/lsmod | grep kvm`" ]; then
	add_module "kvm"
	warn "KVM will not suspend in kernels less than 2.6.23, but should work okay in later kernels."
fi
if [ -n "`/sbin/lsmod | grep kvm_intel`" ]; then
	add_module "kvm_intel"
fi
if [ -n "`/sbin/lsmod | grep kvm_athlon`" ]; then
	add_module "kvm_athlon"
fi

echo

if [ -z "$unload_modules" ] && [ -z "$quirks" ]; then
	echo "Suspend should work!"
else
	echo "Suggestions:"
	echo
	if [ -n "$unload_modules" ]; then
		echo -e "Add 'SUSPEND_MODULES=\"$unload_modules\"' to /etc/pm/config.d/unload_modules!\n"
	fi
	if [ -n "$quirks" ]; then
		echo -n "You might want to try the following pm-suspend entries:"
		echo -e $quirks
	fi
fi

echo

exit 0

