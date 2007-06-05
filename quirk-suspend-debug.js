<!--
function set_state (id, message, icon)
{
	// set text
	var info = document.getElementById (id + "_info")
	info.innerHTML = message;

	// set icon
	var image = document.getElementById (id + "_img")
	image.src = "img/" + icon + ".png";
}

function check_hal_info (id)
{
	var input = document.getElementById (id + "_data");
	if (input.value < 20070402) {
		set_state (id, "Please try with a newer hal-info.", "fail");
	} else if (input.value.length == 0) {
		set_state (id, "Unknown", "unkown");
	} else {
		set_state (id, "", "pass");
	}
}

function check_kernel (id)
{
	var input = document.getElementById (id + "_data");
	if (input.value.indexOf ("xen") != -1) {
		set_state (id, "Cannot suspend xen kernel", "fail");
	} else if (input.value.indexOf ("2.6") == -1) {
		set_state (id, "Is this a valid kernel?", "fail");
	} else if (input.value.indexOf ("2.6.21") == -1) {
		set_state (id, "Please try with a newer kernel", "fail");
	} else if (input.value.length == 0) {
		set_state (id, "Unknown", "unkown");
	} else {
		set_state (id, "", "pass");
	}
}

function check_nvidia (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please try without NVIDIA driver loaded. <a href=\"http://en.opensuse.org/NVidia_Suspend_HOWTO\">This site</a> may provide help if you have to run the driver, but this is <b>completely unsupported</b>.", "fail");
	} else {
		set_state (id, "look for <code>nvidia</code> in <code>/etc/X11/xorg.conf</code>", "unknown");
	}
}

function check_ati (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please try without ATI driver loaded", "fail");
	} else {
		set_state (id, "look for <code>fglrx</code> in <code>/etc/X11/xorg.conf</code>", "unknown");
	}
}


function check_broadcom (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please try without <code>b44</code> module loaded. You can use pm-utils for this.", "fail");
	} else {
		set_state (id, "look for <code>b44</code> in the output of <code>/sbin/lsmod</code>", "unknown");
	}
}


function check_ndiswrapper (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please do not expect ndiswrapper-managed devices to work with suspend.", "fail");
	} else {
		set_state (id, "look for <code>ndiswrapper</code> in the output of <code>/sbin/lsmod</code>", "unknown");
	}
}

function check_intel (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please try using the newer <code>intel</code> modesetting driver", "fail");
	} else {
		set_state (id, "look for <code>i810</code> in <code>/etc/X11/xorg.conf</code>", "unknown");
	}
}

function check_iwl3945 (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "You will need to blacklist <code>iwl3945</code> using <code>SUSPEND_MODULES</code>.", "fail");
	} else {
		set_state (id, "look for <code>iwl3945</code> in <code>/sbin/lsmod | grep iwl</code>", "unknown");
	}
}

function check_kvm (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "You will need to blacklist <code>kvm kvm_intel</code> using <code>SUSPEND_MODULES</code>.", "fail");
	} else {
		set_state (id, "look for <code>kvm</code> in <code>/sbin/lsmod | grep kvm</code>", "unknown");
	}
}

function check_ipw3945d (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please use the <code>mac80211</code> based <code>iwl3945</code> driver instead. ipw3945d is closed source and hangs on resume.", "fail");
	} else {
		set_state (id, "look for <code>ipw3945d</code> in <code>ps aux | grep ipw</code>", "unknown");
	}
}

function check_suspend2 (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Please try using the default kernel suspend", "fail");
	}
}

function check_novbestate (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "Newer intel Xorg drivers seem to have problems with <code>--quirk-vbestate-restore</code>, so <code>--quirk-vbemode-restore</code> should be used instead.", "fail");
	}
}

function check_xorg (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "You might need to use <code>--quirk-vbemode-restore</code> or <code>--quirk-vbestate-restore</code>", "fail");
	}
}

function check_distro (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[1].checked == true) {
		set_state (id, "", "pass");
	} else if (inputs[2].checked == true) {
		set_state (id, "RHEL 5 does not have the same suspend infrastructure.<br>Please open a support call.", "fail");
	} else {
		set_state (id, "Please file a bug with your distro, this helper will not help", "fail");
	}
}

function check_pmutils (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "You might need to use <code>--quirk-s3-bios</code> or <code>--quirk-s3-mode</code>", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_kernelstate (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "Please file a bug in linux kernel bugzilla", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_halproperty (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "Please file a bug in freedesktop bugzilla, component HAL", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_resumeflash (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "You might need to use <code>--quirk-s3-bios</code> or <code>--quirk-s3-mode</code>", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_resumebacklight (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "You might need to use <code>--quirk-dpms-on</code>", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_suspendbacklight (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "You might need to use <code>--quirk-dpms-suspend</code>", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_suspendingconsoles (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "You will need to find and blacklist centain modules using <code>SUSPEND_MODULES</code>.", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_vbestate (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "You might need to use <code>--quirk-vbe-post</code>, <code>--quirk-vbemode-restore</code>, <code>--quirk-vbestate-restore</code> or <code>--quirk-vga-mode3</code>, or a combination of these.", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

function check_kernelpanic (id)
{
	var input = document.getElementById (id + "_data");
	var inputs = input.getElementsByTagName ('input');
	if (inputs[0].checked == true) {
		set_state (id, "The kernel is panicing on resume. See if <code>dmesg</code> contains a backtrace.", "fail");
	} else {
		set_state (id, "", "pass");
	}
}

